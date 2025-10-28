import { z } from 'zod';

import { TransacaoStatus } from '@prisma/client';

const decimalSchema = z.coerce.number();

export const despesaCreateSchema = z.object({
  veiculoId: z.number().int(),
  motoristaId: z.number().int().optional().nullable(),
  viagemId: z.number().int().optional().nullable(),
  data: z.string().or(z.date()).transform((val) => new Date(val)),
  categoria: z.string().optional().nullable(),
  descricao: z.string().optional().nullable(),
  valor: decimalSchema,
  status: z.nativeEnum(TransacaoStatus).optional(),
  dataPagamento: z.string().or(z.date()).transform((val) => (val ? new Date(val) : null)).nullable().optional(),
  meioPagamento: z.string().optional().nullable(),
});

export const despesaUpdateSchema = despesaCreateSchema.partial();
