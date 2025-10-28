import Decimal from 'decimal.js';

import { prisma } from '@/lib/prisma';

interface FilterParams {
  from?: Date;
  to?: Date;
  veiculoId?: number;
  motoristaId?: number;
}

export const computeKpis = async ({ from, to, veiculoId, motoristaId }: FilterParams) => {
  const fretes = await prisma.frete.findMany({
    where: {
      ...(veiculoId ? { veiculoId } : {}),
      ...(motoristaId ? { motoristaId } : {}),
      ...(from || to
        ? {
            data: {
              ...(from ? { gte: from } : {}),
              ...(to ? { lte: to } : {}),
            },
          }
        : {}),
    },
  });

  const abastecimentos = await prisma.abastecimento.findMany({
    where: {
      ...(veiculoId ? { veiculoId } : {}),
      ...(motoristaId ? { motoristaId } : {}),
      ...(from || to
        ? {
            data: {
              ...(from ? { gte: from } : {}),
              ...(to ? { lte: to } : {}),
            },
          }
        : {}),
    },
  });

  const despesas = await prisma.despesa.findMany({
    where: {
      ...(veiculoId ? { veiculoId } : {}),
      ...(motoristaId ? { motoristaId } : {}),
      ...(from || to
        ? {
            data: {
              ...(from ? { gte: from } : {}),
              ...(to ? { lte: to } : {}),
            },
          }
        : {}),
    },
  });

  const manutencoes = await prisma.manutencao.findMany({
    where: {
      ...(veiculoId ? { veiculoId } : {}),
      ...(from || to
        ? {
            data: {
              ...(from ? { gte: from } : {}),
              ...(to ? { lte: to } : {}),
            },
          }
        : {}),
    },
  });

  const receita = fretes.reduce(
    (acc, frete) => acc.plus(new Decimal(frete.valorTotal?.toString() ?? frete.taxaValor?.toString() ?? '0')),
    new Decimal(0),
  );

  const combustivel = abastecimentos.reduce(
    (acc, item) =>
      acc.plus(
        item.valorTotal
          ? new Decimal(item.valorTotal.toString())
          : new Decimal(item.litros.toString()).mul(item.valorUnitario?.toString() ?? '0'),
      ),
    new Decimal(0),
  );

  const custoDespesas = despesas.reduce(
    (acc, despesa) => acc.plus(new Decimal(despesa.valor.toString())),
    new Decimal(0),
  );

  const custoManutencao = manutencoes.reduce(
    (acc, item) => acc.plus(item.custo ? new Decimal(item.custo.toString()) : 0),
    new Decimal(0),
  );

  const kmRodado = abastecimentos.reduce((acc, item) => {
    if (!item.kmAnterior) return acc;
    return acc + (item.kmAtual - item.kmAnterior);
  }, 0);

  const litrosTotais = abastecimentos.reduce((acc, item) => acc + Number(item.litros), 0);
  const consumoMedio = litrosTotais === 0 ? 0 : kmRodado / litrosTotais;

  const rateioPneuMovs = await prisma.movimentacaoPneu.findMany({
    where: {
      ...(veiculoId ? { veiculoId } : {}),
      ...(from || to
        ? {
            data: {
              ...(from ? { gte: from } : {}),
              ...(to ? { lte: to } : {}),
            },
          }
        : {}),
    },
    include: { pneu: true },
  });

  const custoPneus = rateioPneuMovs.reduce(
    (acc, mov) => acc.plus(new Decimal(mov.pneu.valorCompra.toString())),
    new Decimal(0),
  );

  const custoTotal = combustivel.plus(custoDespesas).plus(custoManutencao).plus(custoPneus);
  const lucro = receita.minus(custoTotal);
  const margem = receita.equals(0) ? 0 : lucro.dividedBy(receita);
  const custoPorKm = kmRodado === 0 ? 0 : custoTotal.dividedBy(kmRodado);

  const despesasPorCategoria = despesas.reduce<Record<string, number>>((acc, despesa) => {
    const key = despesa.categoria ?? 'OUTRAS';
    const valor = Number(new Decimal(despesa.valor.toString()).toFixed(2));
    acc[key] = (acc[key] ?? 0) + valor;
    return acc;
  }, {});

  return {
    periodo: {
      from: from?.toISOString(),
      to: to?.toISOString(),
    },
    receita: Number(receita.toFixed(2)),
    custoTotal: Number(custoTotal.toFixed(2)),
    combustivel: Number(combustivel.toFixed(2)),
    despesas: Number(custoDespesas.toFixed(2)),
    manutencao: Number(custoManutencao.toFixed(2)),
    pneus: Number(custoPneus.toFixed(2)),
    lucro: Number(lucro.toFixed(2)),
    margem: Number(margem.toFixed(4)),
    kmRodado,
    consumoMedio,
    custoPorKm: Number(custoPorKm.toFixed(4)),
    despesasPorCategoria,
  };
};
