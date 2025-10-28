import { Router } from 'express';

import { Role } from '@prisma/client';

import { authenticate, authorize } from '@/auth/middleware';
import { computeKpis } from '@/services/kpi.service';

const router = Router();

router.get(
  '/kpis',
  authenticate,
  authorize([Role.admin, Role.gestor, Role.financeiro]),
  async (req, res, next) => {
    try {
      const from = req.query.from ? new Date(req.query.from as string) : undefined;
      const to = req.query.to ? new Date(req.query.to as string) : undefined;
      const veiculoId = req.query.veiculoId ? Number(req.query.veiculoId) : undefined;
      const motoristaId = req.query.motoristaId ? Number(req.query.motoristaId) : undefined;
      const data = await computeKpis({ from, to, veiculoId, motoristaId });
      res.json(data);
    } catch (error) {
      next(error);
    }
  },
);

export { router as dashboardsRouter };
