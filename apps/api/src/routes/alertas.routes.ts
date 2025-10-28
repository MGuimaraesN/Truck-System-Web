import { Router } from 'express';

import { Role } from '@prisma/client';

import { authenticate, authorize } from '@/auth/middleware';
import { computeAlertas } from '@/services/alertas.service';

const router = Router();

router.get('/', authenticate, authorize([Role.admin, Role.gestor, Role.financeiro]), async (req, res, next) => {
  try {
    const dias = req.query.dias ? Number(req.query.dias) : 30;
    const kmMargem = req.query.kmMargem ? Number(req.query.kmMargem) : 500;
    const result = await computeAlertas({ dias, kmMargem });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export { router as alertasRouter };
