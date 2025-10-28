import Decimal from 'decimal.js';

import { prisma } from '@/lib/prisma';

export const getViagemResumo = async (viagemId: number) => {
  const viagem = await prisma.viagem.findUnique({
    where: { id: viagemId },
    include: {
      fretes: true,
      abastecimentos: true,
      despesas: true,
    },
  });

  if (!viagem) {
    throw Object.assign(new Error('Viagem not found'), { status: 404 });
  }

  const receitaFrete = viagem.fretes.reduce((acc, frete) => {
    const valor = new Decimal(
      frete.valorTotal?.toString() ?? frete.taxaValor?.toString() ?? '0',
    );
    return acc.plus(valor);
  }, new Decimal(0));

  const custoAbastecimento = viagem.abastecimentos.reduce((acc, item) => {
    const total = item.valorTotal
      ? new Decimal(item.valorTotal.toString())
      : new Decimal(item.litros.toString()).mul(item.valorUnitario?.toString() ?? '0');
    return acc.plus(total);
  }, new Decimal(0));

  const custoDespesa = viagem.despesas.reduce(
    (acc, despesa) => acc.plus(new Decimal(despesa.valor.toString())),
    new Decimal(0),
  );

  const manutencoes = await prisma.manutencao.findMany({
    where: {
      veiculoId: viagem.veiculoId,
      data: {
        gte: viagem.dataInicio,
        lte: viagem.dataFim ?? new Date(),
      },
    },
  });

  const custoManutencaoRateada = manutencoes.reduce(
    (acc, item) => acc.plus(item.custo ? new Decimal(item.custo.toString()) : 0),
    new Decimal(0),
  );

  const pneuMovs = await prisma.movimentacaoPneu.findMany({
    where: {
      veiculoId: viagem.veiculoId,
      data: {
        gte: viagem.dataInicio,
        lte: viagem.dataFim ?? new Date(),
      },
    },
    include: {
      pneu: true,
    },
  });

  const custoPneuRateado = pneuMovs
    .reduce((acc, mov) => acc.plus(new Decimal(mov.pneu.valorCompra.toString())), new Decimal(0))
    .dividedBy(
      pneuMovs.length || 1,
    );

  const kmRodado = viagem.abastecimentos.reduce((acc, item) => {
    if (!item.kmAnterior) {
      return acc;
    }
    return acc + (item.kmAtual - item.kmAnterior);
  }, 0);

  const custos = custoAbastecimento.plus(custoDespesa).plus(custoManutencaoRateada).plus(custoPneuRateado);
  const lucro = receitaFrete.minus(custos);
  const margem = receitaFrete.equals(0) ? 0 : lucro.dividedBy(receitaFrete);

  return {
    viagemId: viagem.id,
    receitaFrete: Number(receitaFrete.toFixed(2)),
    custoAbastecimento: Number(custoAbastecimento.toFixed(2)),
    custoDespesa: Number(custoDespesa.toFixed(2)),
    custoManutencaoRateada: Number(custoManutencaoRateada.toFixed(2)),
    custoPneuRateado: Number(custoPneuRateado.toFixed(2)),
    kmRodado,
    lucro: Number(lucro.toFixed(2)),
    margem: Number(margem.toFixed(2)),
  };
};
