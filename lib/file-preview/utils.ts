const API_ORIGIN = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(
  /\/$/,
  "",
);

/**
 * Media URLs coming from the backend are often relative storage paths.
 * They must be resolved against the backend origin — otherwise the browser
 * requests them from the frontend host and gets a wrong/404 asset instead.
 */
export function normalizeMediaUrl(raw?: string | null): string | null {
  if (!raw) return null;
  const url = raw.trim();
  if (!url) return null;
  if (/^(https?:|blob:|data:)/i.test(url)) return url;
  if (!API_ORIGIN) return url;
  return `${API_ORIGIN}/${url.replace(/^\//, "")}`;
}

export function isImagePreview(
  mimeType?: string,
  fileType?: string,
  url?: string,
): boolean {
  if (fileType === "image") return true;
  if (mimeType?.startsWith("image/")) return true;

  const path = url?.split("?")[0]?.toLowerCase() ?? "";
  return /\.(png|jpe?g|gif|webp|bmp|svg|avif|ico|heic|heif)$/i.test(path);
}

export function isPdfPreview(
  mimeType?: string,
  fileType?: string,
  url?: string,
): boolean {
  if (fileType === "pdf") return true;
  if (mimeType === "application/pdf") return true;

  const path = url?.split("?")[0]?.toLowerCase() ?? "";
  return path.endsWith(".pdf");
}
