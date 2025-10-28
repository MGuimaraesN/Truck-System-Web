import { z } from 'zod';

import { MovimentacaoPneuTipo, PneuStatus, PosicaoPneu } from '@prisma/client';

const decimalSchema = z.coerce.number();

export const pneuCreateSchema = z.object({
  numSerie: z.string().min(3),
  marca: z.string().min(2),
  modelo: z.string().optional().nullable(),
  dataCompra: z.string().or(z.date()).transform((val) => new Date(val)),
  valorCompra: decimalSchema,
  status: z.nativeEnum(PneuStatus).optional(),
});

export const pneuUpdateSchema = pneuCreateSchema.partial();

export const movimentacaoCreateSchema = z.object({
  veiculoId: z.number().int().optional().nullable(),
  data: z.string().or(z.date()).transform((val) => new Date(val)),
  kmVeiculo: z.number().int(),
  tipo: z.nativeEnum(MovimentacaoPneuTipo),
  posicao: z.nativeEnum(PosicaoPneu).optional().nullable(),
});
