import { despesaCreateSchema, despesaUpdateSchema } from '@/schemas/despesa.schema';
import { createCrudRouter } from './crudFactory';

export const despesasRouter = createCrudRouter({
  model: 'despesa',
  entityName: 'Despesa',
  createSchema: despesaCreateSchema,
  updateSchema: despesaUpdateSchema,
  buildWhere: (query) => {
    const where: any = {};
    if (query.veiculoId) where.veiculoId = Number(query.veiculoId);
    if (query.motoristaId) where.motoristaId = Number(query.motoristaId);
    if (query.viagemId) where.viagemId = Number(query.viagemId);
    if (query.status) where.status = query.status;
    if (query.from || query.to) {
      where.data = {};
      if (query.from) where.data.gte = new Date(query.from as string);
      if (query.to) where.data.lte = new Date(query.to as string);
    }
    return where;
  },
});
