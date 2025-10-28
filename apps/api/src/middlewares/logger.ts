import pinoHttp from 'pino-http';

import { logger } from '@/lib/logger';

export const loggerMiddleware = pinoHttp({
  logger,
  customProps: (req) => ({ correlationId: (req as any).correlationId }),
});
