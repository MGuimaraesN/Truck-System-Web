import { documentoCreateSchema, documentoUpdateSchema } from '@/schemas/documento.schema';
import { createCrudRouter } from './crudFactory';

export const documentosRouter = createCrudRouter({
  model: 'documento',
  entityName: 'Documento',
  createSchema: documentoCreateSchema,
  updateSchema: documentoUpdateSchema,
  buildWhere: (query) => {
    const where: any = {};
    if (query.veiculoId) where.veiculoId = Number(query.veiculoId);
    if (query.from || query.to) {
      where.dataVencimento = {};
      if (query.from) where.dataVencimento.gte = new Date(query.from as string);
      if (query.to) where.dataVencimento.lte = new Date(query.to as string);
    }
    return where;
  },
});
