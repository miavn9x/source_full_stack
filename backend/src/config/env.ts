import 'dotenv/config';
import { z } from 'zod';

const optionalUrl = z.preprocess(
  (value) => (value === '' ? undefined : value),
  z.string().url().optional(),
);

const optionalString = z.preprocess(
  (value) => (value === '' ? undefined : value),
  z.string().optional(),
);

const DEV_ACCESS_SECRET = 'dev-access-secret-change-me-please-32';
const DEV_REFRESH_SECRET = 'dev-refresh-secret-change-me-please-32';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z
    .string()
    .min(1)
    .default('postgresql://postgres:postgres@127.0.0.1:5432/business'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),

  JWT_ACCESS_SECRET: z.string().min(32).default(DEV_ACCESS_SECRET),
  JWT_REFRESH_SECRET: z.string().min(32).default(DEV_REFRESH_SECRET),
  JWT_ACCESS_TTL: z.string().default('15m'),
  JWT_REFRESH_TTL: z.string().default('7d'),

  PLASMIC_HOST: optionalUrl,
  PLASMIC_API_HOST: optionalUrl,
  PLASMIC_PROJECT_ID: optionalString,
  PLASMIC_PROJECT_API_TOKEN: optionalString,
  PLASMIC_WEBHOOK_SECRET: optionalString,

  NEXT_REVALIDATE_URL: optionalUrl,
  REVALIDATE_SECRET: optionalString,

  S3_ENDPOINT: optionalUrl,
  S3_BUCKET: optionalString,
  S3_ACCESS_KEY: optionalString,
  S3_SECRET_KEY: optionalString,
});

export type Env = z.infer<typeof envSchema>;

export const env: Env = envSchema.parse(process.env);

export function assertProductionSecrets(): void {
  if (env.NODE_ENV !== 'production') return;

  const unsafe = [
    env.JWT_ACCESS_SECRET === DEV_ACCESS_SECRET,
    env.JWT_REFRESH_SECRET === DEV_REFRESH_SECRET,
  ];

  if (unsafe.some(Boolean)) {
    throw new Error(
      'Refusing to start in production with development JWT secrets. Set JWT_ACCESS_SECRET and JWT_REFRESH_SECRET.',
    );
  }
}
