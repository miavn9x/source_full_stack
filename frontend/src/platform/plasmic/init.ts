import { initPlasmicLoader } from "@plasmicapp/loader-nextjs/react-server-conditional";
import { env } from "@/shared/config/env";

export const isPlasmicConfigured = Boolean(
  env.NEXT_PUBLIC_PLASMIC_PROJECT_ID && env.NEXT_PUBLIC_PLASMIC_TOKEN,
);

export const PLASMIC = initPlasmicLoader({
  projects: isPlasmicConfigured
    ? [
        {
          id: env.NEXT_PUBLIC_PLASMIC_PROJECT_ID!,
          token: env.NEXT_PUBLIC_PLASMIC_TOKEN!,
        },
      ]
    : [],
  host: env.NEXT_PUBLIC_PLASMIC_HOST || "http://localhost:3003",
  apiHost: env.NEXT_PUBLIC_PLASMIC_API_HOST || "http://localhost:3004",
  cdnHost: env.NEXT_PUBLIC_PLASMIC_CDN_HOST,
  preview: env.NODE_ENV !== "production",
  platform: "nextjs",
  platformOptions: {
    nextjs: {
      appDir: true,
    },
  },
});
