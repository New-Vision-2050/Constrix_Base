import { InternalAxiosRequestConfig } from "axios";
import { getCookie } from "cookies-next";

export const anywhereGetCookieValue = async (
  cookieName: string
): Promise<string | undefined> => {
  if (typeof window === "undefined") {
    // Running on the server
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { cookies } = require("next/headers"); // Require dynamically
    const cookieStore = await cookies();
    return cookieStore.get(cookieName)?.value;
  } else {
    // Running on the client
    return getCookie(cookieName) as string | undefined;
  }
};

export const addCookieToHeaders =
  (
    cookieName: string,
    headerAtr: string,
    parseHeader: (value?: string | boolean | null) => string | undefined | null,
    validate: (value?: string | boolean | null) => boolean
  ) =>
  async (config: InternalAxiosRequestConfig) => {
    const cookieValue = await anywhereGetCookieValue(cookieName);

    if (validate && !validate(cookieValue)) {
      throw new Error(
        JSON.stringify({
          message:
            "Validation Failed for the axios addCookieToHeaders interceptor",
          cookie: { name: cookieName, value: cookieValue },
        })
      );
    }

    if (cookieValue) {
      config.headers[headerAtr] = parseHeader
        ? parseHeader(cookieValue)
        : cookieValue;
    }

    return config;
  };
