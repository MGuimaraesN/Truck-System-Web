import cron from 'node-cron';
import axios from 'axios';
import pino from 'pino';
import dotenv from 'dotenv';

import { PrismaClient } from '@prisma/client';

dotenv.config();

const logger = pino();
const prisma = new PrismaClient();

const API_BASE = process.env.API_URL || 'http://api:3000/api';

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

const authenticate = async () => {
  const email = process.env.WORKER_EMAIL || 'admin@frota.local';
  const password = process.env.WORKER_PASSWORD || 'password123';
  const { data } = await axios.post(`${API_BASE}/auth/login`, { email, password });
  cachedToken = data.accessToken as string;
  tokenExpiresAt = Date.now() + 25 * 60 * 1000;
  return cachedToken;
};

const apiClient = axios.create({ baseURL: API_BASE });

apiClient.interceptors.request.use(async (config) => {
  if (!config.headers.Authorization) {
    if (!cachedToken || Date.now() >= tokenExpiresAt) {
      await authenticate();
    }
    if (cachedToken) {
      config.headers.Authorization = `Bearer ${cachedToken}`;
    }
  }
  return config;
});

const runKpisJob = async () => {
  logger.info('Gerando KPIs do dia');
  try {
    await apiClient.get('/dashboards/kpis');
    logger.info('KPIs atualizados');
  } catch (error) {
    logger.error({ err: error }, 'Falha ao atualizar KPIs');
  }
};

const runAlertasJob = async () => {
  logger.info('Verificando alertas');
  const alertas = await prisma.documento.count({
    where: {
      dataVencimento: {
        lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    },
  });
  logger.info({ alertas }, 'Alertas calculados');
};

const dailyAggregationJob = cron.schedule('0 6 * * *', async () => {
  await runKpisJob();
  await runAlertasJob();
});

logger.info('Worker iniciado');

const shutdown = async (signal: NodeJS.Signals) => {
  logger.info({ signal }, 'Encerrando worker');
  try {
    dailyAggregationJob.stop();
    await prisma.$disconnect();
  } catch (error) {
    logger.error({ err: error }, 'Erro ao encerrar worker');
  } finally {
    process.exit(0);
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
