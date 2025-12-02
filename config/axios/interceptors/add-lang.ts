import axios from "axios";

/**
 * Gets the current locale from different sources depending on the environment
 */
const getCurrentLocale = async (): Promise<string> => {
  if (typeof window === "undefined") {
    // Running on the server
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getLocale } = require("next-intl/server");
      return await getLocale();
    } catch {
      // Fallback: try to get from headers or cookies
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { cookies } = require("next/headers");
        const cookieStore = await cookies();
        const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
        if (localeCookie) {
          return localeCookie;
        }
      } catch {
        // Ignore cookie errors
      }

      // Default fallback
      return "ar"; // Your default locale
    }
  } else {
    // Running on the client
    try {
      // Try to get from URL pathname
      const pathname = window.location.pathname;
      const segments = pathname.split("/");
      const possibleLocale = segments[1];

      // Check if it's a valid locale
      if (possibleLocale && ["ar", "en"].includes(possibleLocale)) {
        return possibleLocale;
      }

      // Fallback to browser language or cookie
      const localeCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("NEXT_LOCALE="))
        ?.split("=")[1];

      if (localeCookie) {
        return localeCookie;
      }

      // Browser language fallback
      const browserLang = navigator.language.split("-")[0];
      return ["ar", "en"].includes(browserLang) ? browserLang : "ar";
    } catch {
      return "ar"; // Default fallback
    }
  }
};

export const addLangHeader: Parameters<
  (typeof axios)["interceptors"]["request"]["use"]
>[0] = async (config) => {
  const locale = await getCurrentLocale();
  config.headers["lang"] = locale;
  return config;
};
