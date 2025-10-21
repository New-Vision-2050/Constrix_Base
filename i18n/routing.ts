import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: [ "ar", "en"],

  defaultLocale: "ar",
  localePrefix: "always",
  localeDetection: false
});