import 'module-alias/register';
import '@total-typescript/ts-reset';

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';

import { loggerMiddleware } from '@/middlewares/logger';
import { requestIdMiddleware } from '@/middlewares/requestId';
import { errorHandler } from '@/middlewares/errorHandler';
import { registry } from '@/metrics/registry';
import { router } from '@/routes';
import { openApiDocument } from '@/openapi';

const app = express();

app.set('trust proxy', 1);
app.use(requestIdMiddleware);
app.use(loggerMiddleware);
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/readiness', (_req, res) => {
  res.json({ status: 'ready', version: '0.1.0' });
});

app.get('/api/metrics', async (_req, res) => {
  res.set('Content-Type', registry.contentType);
  res.end(await registry.metrics());
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use('/api', router);

app.use(errorHandler);

app.use((_req, res) => {
  res.status(404).json({ message: 'Not found' });
});

export { app };
