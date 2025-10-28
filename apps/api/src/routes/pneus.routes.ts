import { Router } from 'express';

import { MovimentacaoPneuTipo, PneuStatus, Role } from '@prisma/client';

import { authenticate, authorize } from '@/auth/middleware';
import { prisma } from '@/lib/prisma';
import { audit } from '@/services/audit.service';
import { movimentacaoCreateSchema, pneuCreateSchema, pneuUpdateSchema } from '@/schemas/pneu.schema';
import { serializeEntity } from '@/utils/serialization';
import { createCrudRouter } from './crudFactory';

const baseRouter = createCrudRouter({
  model: 'pneu',
  entityName: 'Pneu',
  createSchema: pneuCreateSchema,
  updateSchema: pneuUpdateSchema,
  allowedRoles: [Role.admin, Role.gestor],
});

const router = Router();
router.use('/', baseRouter);

router.get('/:id/movimentacoes', authenticate, authorize([Role.admin, Role.gestor]), async (req, res, next) => {
  try {
    const pneuId = Number(req.params.id);
    const movimentacoes = await prisma.movimentacaoPneu.findMany({
      where: { pneuId },
      orderBy: { data: 'desc' },
    });
    res.json(serializeEntity(movimentacoes));
  } catch (error) {
    next(error);
  }
});

router.post('/:id/movimentacoes', authenticate, authorize([Role.admin, Role.gestor]), async (req, res, next) => {
  try {
    const pneuId = Number(req.params.id);
    const data = movimentacaoCreateSchema.parse(req.body);
    const pneu = await prisma.pneu.findUnique({ where: { id: pneuId } });
    if (!pneu) {
      return res.status(404).json({ message: 'Pneu not found' });
    }

    const lastMov = await prisma.movimentacaoPneu.findFirst({
      where: { pneuId },
      orderBy: { data: 'desc' },
    });

    if (data.tipo === MovimentacaoPneuTipo.INSTALACAO) {
      if (lastMov && lastMov.veiculoId && ![MovimentacaoPneuTipo.RETIRADA, MovimentacaoPneuTipo.DESCARTE].includes(lastMov.tipo)) {
        return res.status(400).json({ message: 'Pneu já instalado em um veículo' });
      }
    }

    if (data.tipo === MovimentacaoPneuTipo.RODIZIO) {
      if (!lastMov || !lastMov.veiculoId) {
        return res.status(400).json({ message: 'Rodízio requer instalação ativa' });
      }
      if (!data.veiculoId || data.veiculoId !== lastMov.veiculoId) {
        return res.status(400).json({ message: 'Rodízio deve ocorrer no mesmo veículo' });
      }
    }

    if (
      [MovimentacaoPneuTipo.RETIRADA, MovimentacaoPneuTipo.REFORMA, MovimentacaoPneuTipo.DESCARTE].includes(data.tipo) &&
      !data.kmVeiculo
    ) {
      return res.status(400).json({ message: 'Movimentação requer km do veículo' });
    }

    const created = await prisma.movimentacaoPneu.create({
      data: {
        ...data,
        pneuId,
      },
    });

    let status = pneu.status;
    switch (data.tipo) {
      case MovimentacaoPneuTipo.INSTALACAO:
      case MovimentacaoPneuTipo.RODIZIO:
        status = PneuStatus.EM_USO;
        break;
      case MovimentacaoPneuTipo.REFORMA:
        status = PneuStatus.REFORMADO;
        break;
      case MovimentacaoPneuTipo.RETORNO_REFORMA:
        status = PneuStatus.EM_USO;
        break;
      case MovimentacaoPneuTipo.DESCARTE:
        status = PneuStatus.DESCARTADO;
        break;
      case MovimentacaoPneuTipo.RETIRADA:
        status = PneuStatus.NOVO;
        break;
      default:
        break;
    }

    await prisma.pneu.update({ where: { id: pneuId }, data: { status } });

    await audit({
      userId: req.user?.id,
      action: 'movimentacao',
      entity: 'Pneu',
      entityId: pneuId,
      metadata: { movimentacaoId: created.id, tipo: data.tipo },
      correlationId: req.correlationId,
    });

    res.status(201).json(serializeEntity(created));
  } catch (error) {
    next(error);
  }
});

export { router as pneusRouter };
