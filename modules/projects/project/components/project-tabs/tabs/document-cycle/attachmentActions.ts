import { baseApi } from "@/config/axios/instances/base";

/**
 * Same-origin proxy (see `app/api/download/route.ts`) — server fetches the file so the browser
 * is not blocked by CORS on object-storage URLs (Arabic paths, S3/Spaces, etc.).
 */
async function fetchFileBufferViaDownloadProxy(
  absoluteUrl: string,
): Promise<ArrayBuffer> {
  const proxyUrl = `/api/download?url=${encodeURIComponent(absoluteUrl)}`;
  const res = await fetch(proxyUrl);
  if (!res.ok) {
    throw new Error(`Failed to load file (${res.status})`);
  }
  return res.arrayBuffer();
}

/**
 * Loads a file through the API client (auth headers, relative paths under `/api/v1/...`).
 * Use for iframe/img preview — raw `file_url` often 404s in the browser (wrong origin or no token).
 */
export async function createAuthenticatedPreviewUrl(
  rawUrl: string,
): Promise<string> {
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

/**
 * Same routing as {@link createAuthenticatedPreviewUrl}, but returns raw bytes (no blob URL).
 * Used by Apryse WebViewer (avoids blob revoke / Strict Mode races).
 */
export async function fetchAuthenticatedFileBuffer(
  rawUrl: string,
): Promise<ArrayBuffer> {
  const u = rawUrl.trim();
  if (!u) throw new Error("Missing file URL");

  const base = (baseApi.defaults.baseURL ?? "").replace(/\/$/, "");

  if (/^https?:\/\//i.test(u)) {
    if (base && u.startsWith(base)) {
      const rel = u.slice(base.length).replace(/^\//, "");
      const { data } = await baseApi.get(rel, { responseType: "arraybuffer" });
      return data as ArrayBuffer;
    }
    return fetchFileBufferViaDownloadProxy(u);
  }

  const path = u.replace(/^\//, "");
  const { data } = await baseApi.get(path, { responseType: "arraybuffer" });
  return data as ArrayBuffer;
}

/** Opens the file URL for download (new tab / save). Cross-origin URLs may open in-browser instead of forcing download. */
export function downloadAttachmentFile(file: {
  url: string;
  name: string;
}): void {
  let url = file.url?.trim();
  if (!url) return;
  if (typeof window !== "undefined" && window.location.protocol === "https:") {
    url = url.replace(/^http:\/\//i, "https://");
  }
  const a = document.createElement("a");
  a.href = url;
  a.setAttribute("download", file.name || "attachment");
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * MIME → extension for Apryse when the filename has no useful extension.
 * Covers PDF, Office, OpenDocument, images, AutoCAD, and common web types.
 */
const MIME_TO_EXT: Record<string, string> = {
  "application/pdf": "pdf",
  "application/x-pdf": "pdf",
  "application/rtf": "rtf",
  "text/rtf": "rtf",
  "application/msword": "doc",
  "application/vnd.ms-word": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
  "application/vnd.ms-word.document.macroenabled.12": "docm",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.template":
    "dotx",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.ms-excel.sheet.macroenabled.12": "xlsm",
  "application/vnd.ms-excel.sheet.binary.macroenabled.12": "xlsb",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.template": "xltx",
  "application/vnd.ms-powerpoint": "ppt",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    "pptx",
  "application/vnd.ms-powerpoint.presentation.macroenabled.12": "pptm",
  "application/vnd.openxmlformats-officedocument.presentationml.template": "potx",
  "application/vnd.oasis.opendocument.text": "odt",
  "application/vnd.oasis.opendocument.spreadsheet": "ods",
  "application/vnd.oasis.opendocument.presentation": "odp",
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/pjpeg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/bmp": "bmp",
  "image/x-ms-bmp": "bmp",
  "image/svg+xml": "svg",
  "image/tiff": "tiff",
  "image/x-tiff": "tiff",
  "image/avif": "avif",
  "image/heic": "heic",
  "image/heif": "heif",
  "image/x-icon": "ico",
  "image/vnd.microsoft.icon": "ico",
  "image/jxl": "jxl",
  "image/jp2": "jp2",
  "image/x-portable-pixmap": "ppm",
  "image/x-portable-graymap": "pgm",
  "image/x-portable-bitmap": "pbm",
  "image/x-xbitmap": "xbm",
  "image/x-xpixmap": "xpm",
  "text/plain": "txt",
  "text/html": "html",
  "text/csv": "csv",
  "application/zip": "zip",
  "application/acad": "dwg",
  "image/vnd.dwg": "dwg",
  "application/x-dwg": "dwg",
  "application/x-dwt": "dwt",
  "drawing/x-dwf": "dwf",
  "application/dxf": "dxf",
  "image/vnd.dxf": "dxf",
  "model/vnd.dwf": "dwf",
};

/** Map image/* subtype (after "image/") → file extension when not in MIME_TO_EXT. */
const IMAGE_SUBTYPE_TO_EXT: Record<string, string> = {
  jpeg: "jpg",
  jpg: "jpg",
  pjpeg: "jpg",
  png: "png",
  gif: "gif",
  webp: "webp",
  bmp: "bmp",
  "svg+xml": "svg",
  tiff: "tiff",
  tif: "tif",
  avif: "avif",
  heic: "heic",
  heif: "heif",
  "vnd.microsoft.icon": "ico",
  xicon: "ico",
  jxl: "jxl",
  jp2: "jp2",
  "x-jp2-codestream": "jp2",
};

/** Last path segment extension, e.g. signed `.../file.dwg?token` → `dwg`. */
function extensionFromUrlPath(url: string | undefined): string | undefined {
  const raw = (url ?? "").trim();
  if (!raw) return undefined;
  try {
    const noQuery = raw.split("?")[0].split("#")[0];
    const seg = noQuery.split("/").filter(Boolean).pop() ?? "";
    if (!seg.includes(".")) return undefined;
    const ext = seg.split(".").pop()?.toLowerCase();
    if (ext && /^[a-z0-9]{1,16}$/i.test(ext)) {
      return ext;
    }
  } catch {
    /* ignore */
  }
  return undefined;
}

/**
 * Resolves a lowercase extension for Apryse `loadDocument`.
 * Order: **filename** → **URL path** (when name has no extension) → MIME → `bin`.
 * APIs often send `application/octet-stream`; the real type is inferred from the name/URL.
 */
export function resolveWebViewerExtension(file: {
  name: string;
  type: string;
  url?: string;
}): string {
  const n = (file.name || "").trim();
  if (n.includes(".")) {
    const ext = n.split(".").pop()?.toLowerCase();
    if (ext && /^[a-z0-9]{1,16}$/i.test(ext)) {
      return ext;
    }
  }

  const fromUrl = extensionFromUrlPath(file.url);
  if (fromUrl) {
    return fromUrl;
  }

  const mime = (file.type || "").split(";")[0].trim().toLowerCase();
  if (mime && MIME_TO_EXT[mime]) {
    return MIME_TO_EXT[mime];
  }

  if (mime.startsWith("image/")) {
    const sub = mime.slice("image/".length).toLowerCase();
    if (IMAGE_SUBTYPE_TO_EXT[sub]) {
      return IMAGE_SUBTYPE_TO_EXT[sub];
    }
    const safe = sub.replace(/[^a-z0-9+]/gi, "");
    if (safe === "svgxml" || sub.includes("svg")) return "svg";
    return safe.replace(/\+/g, "") || "png";
  }

  if (mime.startsWith("text/")) {
    const sub = mime.slice("text/".length).toLowerCase();
    if (sub === "plain") return "txt";
    if (sub === "html" || sub === "htm") return "html";
    if (sub === "csv") return "csv";
    const safe = sub.replace(/[^a-z0-9]/gi, "");
    return safe || "txt";
  }

  if (mime === "application/octet-stream") {
    return "bin";
  }

  return "bin";
}

/**
 * DWG/DXF/DWF/DWT are not supported by client-only Apryse WebViewer; they require
 * [WebViewer Server](https://docs.apryse.com/documentation/web/guides/wv-server-deployment).
 */
const CAD_WEBVIEWER_SERVER_ONLY_EXTENSIONS = new Set([
  "dwg",
  "dxf",
  "dwf",
  "dwt",
]);

export function requiresWebViewerServerForPreview(ext: string): boolean {
  const e = ext.replace(/^\./, "").toLowerCase();
  return CAD_WEBVIEWER_SERVER_ONLY_EXTENSIONS.has(e);
}

export type FilePreviewKind = "pdf" | "image" | "other";

/** Coarse category for UI (icons, labels) — not tied to viewer routing. */
export function getFilePreviewKind(file: {
  type: string;
  name: string;
}): FilePreviewKind {
  const mime = (file.type || "").toLowerCase();
  const n = (file.name || "").toLowerCase();
  if (mime.includes("pdf") || n.endsWith(".pdf")) return "pdf";
  if (
    mime.startsWith("image/") ||
    /\.(png|jpe?g|gif|webp|bmp|svg|tiff?|ico|avif|heic|heif|jxl|jp2)$/i.test(n)
  ) {
    return "image";
  }
  return "other";
}
