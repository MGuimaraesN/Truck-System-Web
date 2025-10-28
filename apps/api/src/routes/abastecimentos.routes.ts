import { abastecimentoCreateSchema, abastecimentoUpdateSchema } from '@/schemas/abastecimento.schema';
import { createCrudRouter } from './crudFactory';

export const abastecimentosRouter = createCrudRouter({
  model: 'abastecimento',
  entityName: 'Abastecimento',
  createSchema: abastecimentoCreateSchema,
  updateSchema: abastecimentoUpdateSchema,
  buildWhere: (query) => {
    const where: any = {};
    if (query.veiculoId) where.veiculoId = Number(query.veiculoId);
    if (query.motoristaId) where.motoristaId = Number(query.motoristaId);
    if (query.viagemId) where.viagemId = Number(query.viagemId);
    if (query.from || query.to) {
      where.data = {};
      if (query.from) where.data.gte = new Date(query.from as string);
      if (query.to) where.data.lte = new Date(query.to as string);
    }
    return where;
  },
});
