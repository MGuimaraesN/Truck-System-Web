import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { logger } from '@/lib/logger';

const toProblem = (status: number, title: string, detail?: string, errors?: any) => ({
  type: 'about:blank',
  title,
  status,
  detail,
  errors,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json(
      toProblem(400, 'Invalid request', 'Validation failed', err.flatten()),
    );
  }

  const status = (err as any)?.status ?? 500;
  const message = (err as any)?.message ?? 'Internal server error';

  logger.error({ err, correlationId: (req as any).correlationId });

  return res.status(status).json(
    toProblem(status, status >= 500 ? 'Internal Server Error' : 'Bad Request', message),
  );
};
