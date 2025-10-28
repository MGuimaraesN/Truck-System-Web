import { Router } from 'express';

import { Role } from '@prisma/client';

import { authenticate, authorize } from '@/auth/middleware';
import { viagemCreateSchema, viagemUpdateSchema } from '@/schemas/viagem.schema';
import { getViagemResumo } from '@/services/viagens.service';
import { createCrudRouter } from './crudFactory';

const baseRouter = createCrudRouter({
  model: 'viagem',
  entityName: 'Viagem',
  createSchema: viagemCreateSchema,
  updateSchema: viagemUpdateSchema,
  allowedRoles: [Role.admin, Role.gestor],
  buildWhere: (query) => {
    const where: any = {};
    if (query.veiculoId) where.veiculoId = Number(query.veiculoId);
    if (query.motoristaId) where.motoristaId = Number(query.motoristaId);
    if (query.from || query.to) {
      where.dataInicio = {};
      if (query.from) where.dataInicio.gte = new Date(query.from as string);
      if (query.to) where.dataInicio.lte = new Date(query.to as string);
    }
    return where;
  },
});

const router = Router();
router.use('/', baseRouter);

router.get('/:id/resumo', authenticate, authorize([Role.admin, Role.gestor, Role.financeiro]), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const resumo = await getViagemResumo(id);
    res.json(resumo);
  } catch (error) {
    next(error);
  }
});

export { router as viagensRouter };
