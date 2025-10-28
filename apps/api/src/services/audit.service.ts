import { prisma } from '@/lib/prisma';

interface AuditParams {
  userId?: number;
  action: string;
  entity: string;
  entityId?: number;
  metadata?: Record<string, unknown>;
  correlationId?: string;
}

export const audit = async ({ userId, action, entity, entityId, metadata, correlationId }: AuditParams) => {
  await prisma.auditLog.create({
    data: {
      userId,
      action,
      entity,
      entityId,
      metadata,
      correlationId,
    },
  });
};
