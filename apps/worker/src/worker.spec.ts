import { describe, expect, it, vi } from 'vitest';

import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import type { PrismaClient } from '@prisma/client';
import type { Logger } from 'pino';

import { createWorker, runAlertasJob, runKpisJob } from './worker';

const createApiStub = () => {
  type RequestInterceptor = (config: AxiosRequestConfig) => void | Promise<void>;
  const handlers: RequestInterceptor[] = [];
  return {
    get: vi.fn(async () => {
      const config: AxiosRequestConfig = { headers: {} };
      for (const handler of handlers) {
        await handler(config);
      }
      return { data: {} };
    }),
    interceptors: {
      request: {
        use: (handler: RequestInterceptor) => {
          handlers.push(handler);
          return handlers.length - 1;
        },
        eject: vi.fn(),
      },
    },
  } as unknown as AxiosInstance;
};

const createLoggerStub = () => ({
  info: vi.fn(),
  error: vi.fn(),
}) as unknown as Logger;

describe('worker jobs', () => {
  it('logs success when KPIs job succeeds', async () => {
    const api = createApiStub();
    const logger = createLoggerStub();

    await runKpisJob(api, logger);

    expect(api.get).toHaveBeenCalledWith('/dashboards/kpis');
    expect(logger.info).toHaveBeenCalledWith({ job: 'kpis' }, 'KPIs atualizados com sucesso');
  });

  it('logs error when KPIs job fails', async () => {
    const api = createApiStub();
    const logger = createLoggerStub();
    (api.get as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('network'));

    await runKpisJob(api, logger);

    expect(logger.error).toHaveBeenCalledWith(expect.objectContaining({ job: 'kpis' }), 'Falha ao atualizar KPIs');
  });

  it('counts documentos when calculating alertas', async () => {
    const prisma = {
      documento: { count: vi.fn().mockResolvedValue(2) },
      $disconnect: vi.fn().mockResolvedValue(undefined),
    };
    const logger = createLoggerStub();

    await runAlertasJob(prisma as unknown as PrismaClient, logger);

    expect(prisma.documento.count).toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith({ job: 'alertas', alertas: 2 }, 'Alertas calculados');
  });
});

describe('createWorker', () => {
  const scheduleMock = vi.fn((_, handler: () => Promise<void>) => ({
    start: vi.fn(),
    stop: vi.fn(),
    handler,
  })) as unknown as typeof import('node-cron')['schedule'];

  const setup = async () => {
    const api = createApiStub();
    const logger = createLoggerStub();
    const prisma = {
      documento: { count: vi.fn().mockResolvedValue(0) },
      $disconnect: vi.fn().mockResolvedValue(undefined),
    };
    const authenticate = vi.fn().mockResolvedValue('token');

    const worker = await createWorker({
      prisma: prisma as unknown as PrismaClient,
      api,
      logger,
      authenticate,
      schedule: scheduleMock,
    });

    return { api, logger, prisma, authenticate, worker };
  };

  it('executes jobs immediately on runOnce and authenticates requests', async () => {
    const { api, authenticate, worker } = await setup();

    await worker.runOnce();

    expect(authenticate).toHaveBeenCalled();
    expect(api.get).toHaveBeenCalledWith('/dashboards/kpis');
  });

  it('stops gracefully disconnecting prisma', async () => {
    const { worker, prisma } = await setup();

    await worker.stop();

    expect(prisma.$disconnect).toHaveBeenCalled();
  });
});
