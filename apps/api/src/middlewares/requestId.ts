import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';

export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const headerKey = 'x-correlation-id';
  const existing = req.headers[headerKey] as string | undefined;
  const id = existing ?? randomUUID();
  (req as Request & { correlationId?: string }).correlationId = id;
  res.setHeader(headerKey, id);
  next();
};
