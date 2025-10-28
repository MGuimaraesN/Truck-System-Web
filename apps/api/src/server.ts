import { env } from '@/env';
import { logger } from '@/lib/logger';
import { app } from '@/app';

const port = env.PORT;

app.listen(port, () => {
  logger.info({ port }, 'API listening');
});
