import { z } from "zod";

const optionalUrl = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().url().optional(),
);

const optionalString = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().optional(),
);

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEST_API_URL: z.string().url().default("http://127.0.0.1:4000"),

  // Public read-only Plasmic loader credentials.
  NEXT_PUBLIC_PLASMIC_PROJECT_ID: optionalString,
  NEXT_PUBLIC_PLASMIC_TOKEN: optionalString,
  NEXT_PUBLIC_PLASMIC_HOST: optionalUrl,
  NEXT_PUBLIC_PLASMIC_API_HOST: optionalUrl,
  NEXT_PUBLIC_PLASMIC_CDN_HOST: optionalUrl,

  // Server-only admin link
  PLASMIC_STUDIO_URL: optionalUrl,

  REVALIDATE_SECRET: optionalString,
  PREVIEW_SECRET: optionalString,
});

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEST_API_URL: process.env.NEST_API_URL,
  NEXT_PUBLIC_PLASMIC_PROJECT_ID:
    process.env.NEXT_PUBLIC_PLASMIC_PROJECT_ID,
  NEXT_PUBLIC_PLASMIC_TOKEN: process.env.NEXT_PUBLIC_PLASMIC_TOKEN,
  NEXT_PUBLIC_PLASMIC_HOST: process.env.NEXT_PUBLIC_PLASMIC_HOST,
  NEXT_PUBLIC_PLASMIC_API_HOST:
    process.env.NEXT_PUBLIC_PLASMIC_API_HOST,
  NEXT_PUBLIC_PLASMIC_CDN_HOST:
    process.env.NEXT_PUBLIC_PLASMIC_CDN_HOST,
  PLASMIC_STUDIO_URL: process.env.PLASMIC_STUDIO_URL,
  REVALIDATE_SECRET: process.env.REVALIDATE_SECRET,
  PREVIEW_SECRET: process.env.PREVIEW_SECRET,
});
