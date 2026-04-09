/** Opens the file URL for download (new tab / save). Cross-origin URLs may open in-browser instead of forcing download. */
export function downloadAttachmentFile(file: { url: string; name: string }): void {
  const url = file.url?.trim();
  if (!url) return;
  const a = document.createElement("a");
  a.href = url;
  a.setAttribute("download", file.name || "attachment");
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export type FilePreviewKind = "pdf" | "image" | "other";

export function getFilePreviewKind(file: {
  type: string;
  name: string;
}): FilePreviewKind {
  const mime = (file.type || "").toLowerCase();
  const n = (file.name || "").toLowerCase();
  if (mime.includes("pdf") || n.endsWith(".pdf")) return "pdf";
  if (
    mime.startsWith("image/") ||
    /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(n)
  )
    return "image";
  return "other";
}
