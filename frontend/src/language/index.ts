import viCommon from "./vi/common.json";
import viAdmin from "./vi/admin.json";
import enCommon from "./en/common.json";
import enAdmin from "./en/admin.json";

export const translations = {
  vi: {
    common: viCommon,
    admin: viAdmin,
  },
  en: {
    common: enCommon,
    admin: enAdmin,
  },
} as const;

export type SupportedLocale = keyof typeof translations;
export const defaultLocale: SupportedLocale = "vi";
