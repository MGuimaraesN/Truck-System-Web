import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url().or(z.string().startsWith('file:')),
  JWT_SECRET: z.string().min(16),
  ACCESS_TOKEN_TTL_MINUTES: z.coerce.number().default(30),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().default(7),
  DEFAULT_VEHICLE_ID: z.coerce.number().optional(),
  MAIL_HOST: z.string().default('mailhog'),
  MAIL_PORT: z.coerce.number().default(1025),
  MAIL_FROM: z.string().default('Frota Sapiens <no-reply@frotasapiens.local>'),
});

type Env = z.infer<typeof envSchema>;

const env: Env = envSchema.parse(process.env);

export { env };
