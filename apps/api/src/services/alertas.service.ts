import { addDays } from 'date-fns';

import { prisma } from '@/lib/prisma';

interface AlertFilters {
  dias: number;
  kmMargem: number;
}

export const computeAlertas = async ({ dias, kmMargem }: AlertFilters) => {
  const limite = addDays(new Date(), dias);

  const documentosVencendo = await prisma.documento.findMany({
    where: {
      dataVencimento: {
        lte: limite,
      },
    },
    orderBy: { dataVencimento: 'asc' },
  });

  const manutencoesProximas = await prisma.manutencao.findMany({
    where: {
      kmProximaTroca: {
        not: null,
      },
    },
  });

  const manutencoesFiltradas = manutencoesProximas
    .filter((manutencao) => {
      if (!manutencao.kmProximaTroca || !manutencao.kmAtual) return false;
      return manutencao.kmProximaTroca - manutencao.kmAtual <= kmMargem;
    })
    .map((manutencao) => ({
      veiculoId: manutencao.veiculoId,
      tipo: manutencao.tipo ?? 'MANUTENCAO',
      kmAtual: manutencao.kmAtual,
      kmProximaTroca: manutencao.kmProximaTroca,
    }));

  const cnhVencendo = await prisma.motorista.findMany({
    where: {
      validadeCnh: {
        lte: limite,
      },
    },
    select: {
      id: true,
      nome: true,
      validadeCnh: true,
    },
  });

  return {
    documentosVencendo: documentosVencendo.map((doc) => ({
      veiculoId: doc.veiculoId,
      tipo: doc.tipo,
      dataVencimento: doc.dataVencimento.toISOString(),
    })),
    manutencoesProximas: manutencoesFiltradas,
    cnhVencendo: cnhVencendo.map((motorista) => ({
      motoristaId: motorista.id,
      nome: motorista.nome,
      validadeCnh: motorista.validadeCnh.toISOString(),
    })),
  };
};
