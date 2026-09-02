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
