import { z } from 'zod';

export const veiculoCreateSchema = z.object({
  placa: z.string().min(5).optional().nullable(),
  descricao: z.string().optional().nullable(),
  ativo: z.boolean().optional().default(true),
});

export const veiculoUpdateSchema = veiculoCreateSchema.partial();
