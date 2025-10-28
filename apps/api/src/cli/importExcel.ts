import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';

import { readFile, utils, SSF } from 'xlsx';
import type { WorkBook } from 'xlsx';

import { TransacaoStatus } from '@prisma/client';
import { env } from '@/env';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export interface CliArgs {
  file: string;
  veiculoId?: number;
  placa?: string;
}

export const parseArgs = (): CliArgs => {
  const args = process.argv.slice(2);
  const result: CliArgs = {
    file: '/data/input/Frete.xlsx',
  };
  for (const arg of args) {
    if (arg.startsWith('--file=')) result.file = arg.split('=')[1];
    if (arg.startsWith('--veiculo=')) result.veiculoId = Number(arg.split('=')[1]);
    if (arg.startsWith('--placa=')) result.placa = arg.split('=')[1];
  }
  return result;
};

export const sanitizeRow = (row: any) => {
  const normalized: Record<string, any> = {};
  for (const [key, value] of Object.entries(row)) {
    if (
      !key ||
      key.toLowerCase().startsWith('total') ||
      key.toLowerCase().startsWith('col') ||
      key.toLowerCase().includes('tabela') ||
      key.toLowerCase().includes('pivot') ||
      key.toLowerCase().includes('__empty')
    ) {
      continue;
    }
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed.toLowerCase().includes('total') && Object.keys(row).length < 3) {
        return null;
      }
      normalized[key.trim()] = trimmed === '' ? null : trimmed;
    } else {
      normalized[key.trim()] = value;
    }
  }
  return normalized;
};

export const loadSheet = (workbook: WorkBook, name: string) => {
  const normalizedTarget = name.toLowerCase();
  const sheetName = workbook.SheetNames.find((sheet) => {
    const lower = sheet.toLowerCase();
    if (!lower.includes(normalizedTarget)) return false;
    return !/(total|resumo|pivot|dash|_filtro)/.test(lower);
  });
  if (!sheetName) return [];
  const sheet = workbook.Sheets[sheetName];
  const json = utils.sheet_to_json(sheet, { defval: null });
  const sanitized = json
    .map((row) => sanitizeRow(row))
    .filter((row): row is Record<string, any> => row !== null)
    .filter((row) => {
      const values = Object.values(row).join(' ').toLowerCase();
      return !values.includes('total');
    });
  return sanitized;
};

export const ensureVeiculo = async ({ veiculoId, placa }: { veiculoId?: number; placa?: string }) => {
  if (veiculoId) {
    return veiculoId;
  }
  if (placa) {
    const veiculo = await prisma.veiculo.findFirst({ where: { placa } });
    if (veiculo) {
      return veiculo.id;
    }
  }
  if (env.DEFAULT_VEHICLE_ID) {
    return env.DEFAULT_VEHICLE_ID;
  }
  throw new Error('Veículo não informado. Use --veiculo=ID ou configure DEFAULT_VEHICLE_ID.');
};

export const hashRow = (row: any) => createHash('sha256').update(JSON.stringify(row)).digest('hex');

export const normalizeNumber = (value: any) => {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return value;
  const raw = String(value).trim();
  if (!raw) return null;
  const cleaned = raw.replace(/\./g, '').replace(',', '.');
  const parsed = Number(cleaned);
  return Number.isNaN(parsed) ? null : parsed;
};

export const parseDate = (value: any) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  const asNumber = Number(value);
  if (!Number.isNaN(asNumber) && asNumber > 40000) {
    const parsed = SSF.parse_date_code(asNumber);
    if (parsed) {
      return new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d));
    }
  }
  return new Date(value);
};

export const inferCategoria = (descricao?: string | null) => {
  if (!descricao) return 'OUTRAS';
  const text = descricao.toLowerCase();
  if (text.includes('pedagio')) return 'PEDAGIO';
  if (text.includes('borracharia')) return 'MANUTENCAO_PNEU';
  if (text.includes('hotel') || text.includes('pousada')) return 'ESTADIA';
  if (text.includes('lavagem')) return 'LAVAGEM';
  return 'OUTRAS';
};

export const backfillKmAnterior = async (veiculoId: number) => {
  const abastecimentos = await prisma.abastecimento.findMany({
    where: { veiculoId },
    orderBy: { data: 'asc' },
  });
  let previousKm: number | null = null;
  for (const abastecimento of abastecimentos) {
    if (previousKm !== null && !abastecimento.kmAnterior) {
      await prisma.abastecimento.update({
        where: { id: abastecimento.id },
        data: { kmAnterior: previousKm },
      });
    }
    previousKm = abastecimento.kmAtual;
  }
};

export const main = async () => {
  const args = parseArgs();
  const veiculoId = await ensureVeiculo({ veiculoId: args.veiculoId, placa: args.placa });
  const filePath = path.resolve(args.file);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Arquivo não encontrado: ${filePath}`);
  }

  logger.info({ filePath, veiculoId }, 'Importando planilha');
  const workbook = readFile(filePath, { cellDates: true });

  const fretes = loadSheet(workbook, 'Frete');
  for (const row of fretes) {
    const hash = hashRow({ ...row, veiculoId });
    const data = parseDate(row['Data']);
    if (!data) continue;
    await prisma.frete.upsert({
      where: { hashImportacao: hash },
      update: {
        data,
        descricao: row['Observações'] ?? null,
        origem: row['Origem'] ?? null,
        destino: row['Destino'] ?? null,
        taxaValor: normalizeNumber(row['Valor']) ?? null,
        valorTotal: normalizeNumber(row['Valor Bruto']) ?? null,
      },
      create: {
        veiculoId,
        data,
        descricao: row['Observações'] ?? null,
        origem: row['Origem'] ?? null,
        destino: row['Destino'] ?? null,
        taxaValor: normalizeNumber(row['Valor']) ?? null,
        valorTotal: normalizeNumber(row['Valor Bruto']) ?? null,
        status: TransacaoStatus.PENDENTE,
        hashImportacao: hash,
      },
    });
  }

  const abastecimentos = loadSheet(workbook, 'Abastecimento');
  for (const row of abastecimentos) {
    const hash = hashRow({ ...row, veiculoId });
    const data = parseDate(row['Data']);
    if (!data) continue;
    await prisma.abastecimento.upsert({
      where: { hashImportacao: hash },
      update: {
        data,
        posto: [row['Posto'], row['Cidade']].filter(Boolean).join(' - ') || null,
        litros: normalizeNumber(row['Litros']) ?? 0,
        valorUnitario: normalizeNumber(row['Valor Diesel']) ?? null,
        valorTotal: normalizeNumber(row['Valor Total']) ?? null,
        kmAnterior: normalizeNumber(row['Km Anterior']) ?? null,
        kmAtual: normalizeNumber(row['Km Atual']) ?? 0,
      },
      create: {
        veiculoId,
        data,
        posto: [row['Posto'], row['Cidade']].filter(Boolean).join(' - ') || null,
        litros: normalizeNumber(row['Litros']) ?? 0,
        valorUnitario: normalizeNumber(row['Valor Diesel']) ?? null,
        valorTotal: normalizeNumber(row['Valor Total']) ?? null,
        kmAnterior: normalizeNumber(row['Km Anterior']) ?? null,
        kmAtual: normalizeNumber(row['Km Atual']) ?? 0,
        hashImportacao: hash,
      },
    });
  }

  const despesas = loadSheet(workbook, 'Despesa');
  for (const row of despesas) {
    const hash = hashRow({ ...row, veiculoId });
    const data = parseDate(row['Data']);
    if (!data) continue;
    await prisma.despesa.upsert({
      where: { hashImportacao: hash },
      update: {
        data,
        descricao: row['Descrição'] ?? null,
        categoria: inferCategoria(row['Descrição'] ?? undefined),
        valor: normalizeNumber(row['Valor']) ?? 0,
        status: TransacaoStatus.PENDENTE,
      },
      create: {
        veiculoId,
        data,
        descricao: row['Descrição'] ?? null,
        categoria: inferCategoria(row['Descrição'] ?? undefined),
        valor: normalizeNumber(row['Valor']) ?? 0,
        status: TransacaoStatus.PENDENTE,
        hashImportacao: hash,
      },
    });
  }

  const trocas = loadSheet(workbook, 'Troca');
  for (const row of trocas) {
    const hash = hashRow({ ...row, veiculoId });
    const data = parseDate(row['Data']);
    if (!data) continue;
    await prisma.manutencao.upsert({
      where: { hashImportacao: hash },
      update: {
        data,
        tipo: 'TROCA_DE_OLEO',
        descricao: row['Descrição'] ?? null,
        kmAtual: normalizeNumber(row['KM']) ?? null,
        kmProximaTroca: normalizeNumber(row['KM P/ Nova Troca']) ?? null,
      },
      create: {
        veiculoId,
        data,
        tipo: 'TROCA_DE_OLEO',
        descricao: row['Descrição'] ?? null,
        kmAtual: normalizeNumber(row['KM']) ?? null,
        kmProximaTroca: normalizeNumber(row['KM P/ Nova Troca']) ?? null,
        hashImportacao: hash,
      },
    });
  }

  await backfillKmAnterior(veiculoId);
  logger.info('Importação concluída');
};

if (require.main === module) {
  main()
    .then(async () => {
      await prisma.$disconnect();
      process.exit(0);
    })
    .catch(async (error) => {
      logger.error({ err: error }, 'Falha ao importar planilha');
      await prisma.$disconnect();
      process.exit(1);
    });
}
