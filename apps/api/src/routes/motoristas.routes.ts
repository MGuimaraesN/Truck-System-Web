import { motoristaCreateSchema, motoristaUpdateSchema } from '@/schemas/motorista.schema';
import { createCrudRouter } from './crudFactory';

export const motoristasRouter = createCrudRouter({
  model: 'motorista',
  entityName: 'Motorista',
  createSchema: motoristaCreateSchema,
  updateSchema: motoristaUpdateSchema,
});
