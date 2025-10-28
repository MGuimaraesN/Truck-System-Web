import { z } from 'zod';

import { DocumentoTipo } from '@prisma/client';

export const documentoCreateSchema = z.object({
  veiculoId: z.number().int(),
  tipo: z.nativeEnum(DocumentoTipo),
  descricao: z.string().optional().nullable(),
  dataVencimento: z.string().or(z.date()).transform((val) => new Date(val)),
});

export const documentoUpdateSchema = documentoCreateSchema.partial();
