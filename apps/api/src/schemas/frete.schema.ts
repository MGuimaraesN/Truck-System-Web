import { z } from 'zod';

import { TransacaoStatus } from '@prisma/client';

const decimalSchema = z.coerce.number().transform((value) => Number(value.toFixed(2)));

export const freteCreateSchema = z.object({
  veiculoId: z.number().int(),
  motoristaId: z.number().int().optional().nullable(),
  viagemId: z.number().int().optional().nullable(),
  data: z.string().or(z.date()).transform((val) => new Date(val)),
  descricao: z.string().optional().nullable(),
  origem: z.string().optional().nullable(),
  destino: z.string().optional().nullable(),
  taxaValor: decimalSchema.optional().nullable(),
  valorTotal: decimalSchema.optional().nullable(),
  status: z.nativeEnum(TransacaoStatus).optional(),
  dataPagamento: z.string().or(z.date()).transform((val) => (val ? new Date(val) : null)).nullable().optional(),
  meioPagamento: z.string().optional().nullable(),
});

export const freteUpdateSchema = freteCreateSchema.partial();
