import { veiculoCreateSchema, veiculoUpdateSchema } from '@/schemas/veiculo.schema';
import { createCrudRouter } from './crudFactory';

export const veiculosRouter = createCrudRouter({
  model: 'veiculo',
  entityName: 'Veiculo',
  createSchema: veiculoCreateSchema,
  updateSchema: veiculoUpdateSchema,
});
