import { z } from 'zod';

const decimalSchema = z.coerce.number();

export const manutencaoCreateSchema = z.object({
  veiculoId: z.number().int(),
  motoristaId: z.number().int().optional().nullable(),
  data: z.string().or(z.date()).transform((val) => new Date(val)),
  tipo: z.string().optional().nullable(),
  descricao: z.string().optional().nullable(),
  custo: decimalSchema.optional().nullable(),
  kmAtual: z.number().int().optional().nullable(),
  kmProximaTroca: z.number().int().optional().nullable(),
});

export const manutencaoUpdateSchema = manutencaoCreateSchema.partial();
