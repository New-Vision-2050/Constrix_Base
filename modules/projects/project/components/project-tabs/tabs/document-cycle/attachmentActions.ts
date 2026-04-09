import { baseApi } from "@/config/axios/instances/base";

/**
 * Loads a file through the API client (auth headers, relative paths under `/api/v1/...`).
 * Use for iframe/img preview — raw `file_url` often 404s in the browser (wrong origin or no token).
 */
export async function createAuthenticatedPreviewUrl(rawUrl: string): Promise<string> {
  const u = rawUrl.trim();
  if (!u) throw new Error("Missing file URL");

  const base = (baseApi.defaults.baseURL ?? "").replace(/\/$/, "");

  if (/^https?:\/\//i.test(u)) {
    if (base && u.startsWith(base)) {
      const rel = u.slice(base.length).replace(/^\//, "");
      const { data } = await baseApi.get(rel, { responseType: "blob" });
      return URL.createObjectURL(data);
    }
    return u;
  }

  const path = u.replace(/^\//, "");
  const { data } = await baseApi.get(path, { responseType: "blob" });
  return URL.createObjectURL(data);
}

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
