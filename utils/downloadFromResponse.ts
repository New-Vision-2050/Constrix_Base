import { AxiosResponse } from "axios";

/**
 * Extracts the filename from a response's Content-Disposition header.
 *
 * Prefers the RFC 5987 `filename*=UTF-8''...` form (which correctly
 * encodes non-ASCII filenames such as Arabic), and falls back to the
 * legacy `filename="..."` form, then to the supplied fallback.
 */
export const filenameFromResponse = (
  response: AxiosResponse,
  fallback: string = "download",
): string => {
  const headers = (response?.headers ?? {}) as Record<string, unknown>;
  const raw =
    headers["content-disposition"] ?? headers["Content-Disposition"];
  const cd = typeof raw === "string" ? raw : undefined;
  if (!cd) return fallback;

  const utf8Match = /filename\*\s*=\s*UTF-8''([^;]+)/i.exec(cd);
  if (utf8Match?.[1]) {
    const value = utf8Match[1].trim().replace(/^"|"$/g, "");
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  }

  const asciiMatch = /filename\s*=\s*"?([^";]+)"?/i.exec(cd);
  if (asciiMatch?.[1]) {
    return asciiMatch[1].trim();
  }

  return fallback;
};

/**
 * Downloads a file from an axios blob response, honouring the server's
 * Content-Disposition filename (including RFC 5987 UTF-8 form).
 *
 * @param response - Axios response with blob data.
 * @param fallbackFilename - Filename to use if the server did not provide one.
 *   This is a *fallback*, not an override: a valid Content-Disposition filename
 *   from the server always wins.
 */
export const downloadFromResponse = (
  response: AxiosResponse,
  fallbackFilename: string = "download",
) => {
  const finalFilename = filenameFromResponse(response, fallbackFilename);
  const contentType =
    (response.headers?.["content-type"] as string | undefined) ||
    "application/octet-stream";

  const blob = new Blob([response.data], { type: contentType });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = finalFilename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
