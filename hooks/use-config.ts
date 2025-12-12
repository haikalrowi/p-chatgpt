import { useChangeLocale, useCurrentLocale, useI18n } from "@/locales/client";

export function useConfig() {
  return {
    t: useI18n(),
    locale: useCurrentLocale(),
    changeLocale: useChangeLocale(),
  };
}
