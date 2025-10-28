import { z } from 'zod';

export const viagemCreateSchema = z.object({
  descricao: z.string().min(3),
  dataInicio: z.string().or(z.date()).transform((val) => new Date(val)),
  dataFim: z.string().or(z.date()).transform((val) => new Date(val)).optional().nullable(),
  veiculoId: z.number().int(),
  motoristaId: z.number().int(),
});

export const viagemUpdateSchema = viagemCreateSchema.partial();
