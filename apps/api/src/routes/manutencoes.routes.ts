import { manutencaoCreateSchema, manutencaoUpdateSchema } from '@/schemas/manutencao.schema';
import { createCrudRouter } from './crudFactory';

export const manutencoesRouter = createCrudRouter({
  model: 'manutencao',
  entityName: 'Manutencao',
  createSchema: manutencaoCreateSchema,
  updateSchema: manutencaoUpdateSchema,
  buildWhere: (query) => {
    const where: any = {};
    if (query.veiculoId) where.veiculoId = Number(query.veiculoId);
    if (query.motoristaId) where.motoristaId = Number(query.motoristaId);
    if (query.from || query.to) {
      where.data = {};
      if (query.from) where.data.gte = new Date(query.from as string);
      if (query.to) where.data.lte = new Date(query.to as string);
    }
    return where;
  },
});
