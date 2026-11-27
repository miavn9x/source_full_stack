import { env } from "./env";

export type VisualBuilderKind = "plasmic" | "placeholder";

export const visualBuilder: VisualBuilderKind = "plasmic";

export const features = {
  plasmic: Boolean(
    env.NEXT_PUBLIC_PLASMIC_PROJECT_ID && env.NEXT_PUBLIC_PLASMIC_TOKEN,
  ),
  crm: true,
  auditLog: true,
} as const;
