import { baseApi } from "@/config/axios/instances/base";
import type {
  GetProjectStampResponse,
  ProjectStampDto,
  UploadProjectStampResponse,
} from "./types/response";

const URL_KEYS = [
  "url",
  "stamp_url",
  "file_url",
  "image_url",
  "original_url",
  "preview_url",
  "full_url",
  "path",
  "file_path",
  "src",
] as const;

const NESTED_KEYS = [
  "stamp",
  "file",
  "media",
  "image",
  "data",
  "payload",
] as const;

function looksLikeUrl(value: string): boolean {
  const t = value.trim();
  if (!t) return false;
  return (
    /^(https?:|blob:|data:)/i.test(t) ||
    t.startsWith("/") ||
    t.includes("/") ||
    /\.(png|jpe?g|webp|gif|svg)(\?|#|$)/i.test(t)
  );
}

function toAbsoluteProjectStampUrl(url: string): string {
  const t = url.trim();
  if (!t) return t;
  if (/^(https?:|blob:|data:)/i.test(t)) return t;
  const origin = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(
    /\/$/,
    "",
  );
  if (!origin) return t;
  return t.startsWith("/") ? `${origin}${t}` : `${origin}/${t}`;
}

function findStampUrl(value: unknown, depth = 0): string | null {
  if (value == null || depth > 5) return null;

  if (typeof value === "string") {
    const t = value.trim();
    return t && looksLikeUrl(t) ? t : null;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findStampUrl(item, depth + 1);
      if (found) return found;
    }
    return null;
  }

  if (typeof value !== "object") return null;

  const obj = value as Record<string, unknown>;
  for (const key of URL_KEYS) {
    const raw = obj[key];
    if (typeof raw === "string" && raw.trim()) {
      const t = raw.trim();
      if (looksLikeUrl(t) || key !== "path") return t;
    }
  }

  for (const key of NESTED_KEYS) {
    if (key in obj) {
      const found = findStampUrl(obj[key], depth + 1);
      if (found) return found;
    }
  }

  return null;
}

export function resolveProjectStampUrl(
  payload: ProjectStampDto | string | null | undefined | unknown,
): string | null {
  const found = findStampUrl(payload);
  return found ? toAbsoluteProjectStampUrl(found) : null;
}

/** Reads stamp URL from a full API body (`payload`, `data`, or the body itself). */
export function resolveStampUrlFromApiBody(body: unknown): string | null {
  if (!body || typeof body !== "object") {
    return resolveProjectStampUrl(body);
  }
  const obj = body as Record<string, unknown>;
  return (
    resolveProjectStampUrl(obj.payload) ||
    resolveProjectStampUrl(obj.data) ||
    resolveProjectStampUrl(obj)
  );
}

/** Matches backend `UploadProjectStampRequest`: max 2048 KB */
export const PROJECT_STAMP_MAX_BYTES = 2048 * 1024;

export const PROJECT_STAMP_ACCEPT =
  "image/jpeg,image/jpg,image/png,image/webp";

export function validateProjectStampFile(file: File): string | null {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowed.includes(file.type)) {
    return "نوع الملف غير مدعوم. المسموح: JPG, PNG, WebP";
  }
  if (file.size > PROJECT_STAMP_MAX_BYTES) {
    return "حجم الملف يجب ألا يتجاوز 2 ميجابايت";
  }
  return null;
}

export const ProjectStampApi = {
  get: (projectId: string | number) =>
    baseApi.get<GetProjectStampResponse>(`projects/${projectId}/stamp`),

  getAsBlob: (projectId: string | number) =>
    baseApi.get<Blob>(`projects/${projectId}/stamp`, {
      responseType: "blob",
    }),

  upload: (projectId: string | number, file: File) => {
    const formData = new FormData();
    formData.append("stamp", file);
    return baseApi.post<UploadProjectStampResponse>(
      `projects/${projectId}/stamp`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  },
};

export type { ProjectStampDto } from "./types/response";
