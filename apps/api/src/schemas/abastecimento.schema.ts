import { z } from 'zod';

const decimalSchema = z.coerce.number();

export const abastecimentoCreateSchema = z.object({
  veiculoId: z.number().int(),
  motoristaId: z.number().int().optional().nullable(),
  viagemId: z.number().int().optional().nullable(),
  data: z.string().or(z.date()).transform((val) => new Date(val)),
  posto: z.string().optional().nullable(),
  litros: decimalSchema,
  valorUnitario: decimalSchema.optional().nullable(),
  valorTotal: decimalSchema.optional().nullable(),
  kmAnterior: z.number().int().optional().nullable(),
  kmAtual: z.number().int(),
});

export const abastecimentoUpdateSchema = abastecimentoCreateSchema.partial();
