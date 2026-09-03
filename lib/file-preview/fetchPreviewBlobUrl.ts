import { baseApi } from "@/config/axios/instances/base";

async function fetchBufferViaDownloadProxy(
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
 * Fetches a file and returns a same-origin blob URL suitable for iframe/object preview.
 * External storage URLs (DigitalOcean Spaces, S3, etc.) block iframe embedding via
 * X-Frame-Options — proxying through `/api/download` avoids that.
 */
export async function fetchPreviewBlobUrl(
  rawUrl: string,
  mimeType?: string,
): Promise<string> {
  const url = rawUrl.trim();
  if (!url) throw new Error("Missing file URL");

  if (url.startsWith("blob:") || url.startsWith("data:")) {
    return url;
  }

  const base = (baseApi.defaults.baseURL ?? "").replace(/\/$/, "");
  let buffer: ArrayBuffer;

  if (/^https?:\/\//i.test(url)) {
    if (base && url.startsWith(base)) {
      const rel = url.slice(base.length).replace(/^\//, "");
      const { data } = await baseApi.get(rel, { responseType: "arraybuffer" });
      buffer = data as ArrayBuffer;
    } else {
      buffer = await fetchBufferViaDownloadProxy(url);
    }
  } else {
    const path = url.replace(/^\//, "");
    const { data } = await baseApi.get(path, { responseType: "arraybuffer" });
    buffer = data as ArrayBuffer;
  }

  const blob = new Blob([buffer], {
    type: mimeType || "application/octet-stream",
  });
  return URL.createObjectURL(blob);
}
