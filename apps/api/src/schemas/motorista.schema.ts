import { z } from 'zod';

export const motoristaCreateSchema = z.object({
  nome: z.string().min(3),
  cpf: z.string().min(11),
  cnh: z.string().min(5),
  validadeCnh: z.string().or(z.date()).transform((val) => new Date(val)),
});

export const motoristaUpdateSchema = motoristaCreateSchema.partial();
