import { Router } from 'express';
import { ZodTypeAny } from 'zod';

import { Role } from '@prisma/client';

import { authenticate, authorize } from '@/auth/middleware';
import { prisma } from '@/lib/prisma';
import { audit } from '@/services/audit.service';
import { getPagination } from '@/utils/pagination';
import { serializeEntity } from '@/utils/serialization';

interface CrudOptions<TCreate extends ZodTypeAny, TUpdate extends ZodTypeAny> {
  model: keyof typeof prisma;
  entityName: string;
  createSchema: TCreate;
  updateSchema: TUpdate;
  allowedRoles?: Role[];
  defaultOrderBy?: Record<string, 'asc' | 'desc'>;
  buildWhere?: (query: any) => any;
}

export const createCrudRouter = <TCreate extends ZodTypeAny, TUpdate extends ZodTypeAny>({
  model,
  entityName,
  createSchema,
  updateSchema,
  allowedRoles = [Role.admin, Role.gestor, Role.financeiro],
  defaultOrderBy = { id: 'desc' },
  buildWhere,
}: CrudOptions<TCreate, TUpdate>) => {
  const router = Router();
  const delegate: any = (prisma as any)[model];

  router.use(authenticate, authorize(allowedRoles));

  router.get('/', async (req, res, next) => {
    try {
      const { page, pageSize } = getPagination(req);
      const where = buildWhere ? buildWhere(req.query) : {};
      const [items, total] = await prisma.$transaction([
        delegate.findMany({
          where,
          skip: (page - 1) * pageSize,
          take: pageSize,
          orderBy: defaultOrderBy,
        }),
        delegate.count({ where }),
      ]);
      res.json({
        data: serializeEntity(items),
        pagination: {
          page,
          pageSize,
          total,
        },
      });
    } catch (error) {
      next(error);
    }
  });

  router.get('/:id', async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const item = await delegate.findUnique({ where: { id } });
      if (!item) {
        return res.status(404).json({ message: `${entityName} not found` });
      }
      res.json(serializeEntity(item));
    } catch (error) {
      next(error);
    }
  });

  router.post('/', async (req, res, next) => {
    try {
      const data = createSchema.parse(req.body);
      const created = await delegate.create({ data });
      await audit({
        userId: req.user?.id,
        action: 'create',
        entity: entityName,
        entityId: created.id,
        metadata: data,
        correlationId: req.correlationId,
      });
      res.status(201).json(serializeEntity(created));
    } catch (error) {
      next(error);
    }
  });

  router.patch('/:id', async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const data = updateSchema.parse(req.body);
      const updated = await delegate.update({ where: { id }, data });
      await audit({
        userId: req.user?.id,
        action: 'update',
        entity: entityName,
        entityId: updated.id,
        metadata: data,
        correlationId: req.correlationId,
      });
      res.json(serializeEntity(updated));
    } catch (error) {
      next(error);
    }
  });

  router.delete('/:id', async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      await delegate.delete({ where: { id } });
      await audit({
        userId: req.user?.id,
        action: 'delete',
        entity: entityName,
        entityId: id,
        correlationId: req.correlationId,
      });
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  return router;
};
