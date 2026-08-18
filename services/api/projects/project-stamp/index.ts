import { baseApi } from "@/config/axios/instances/base";
import type {
  GetProjectStampResponse,
  ProjectStampDto,
  UploadProjectStampResponse,
} from "./types/response";

export function resolveProjectStampUrl(
  payload: ProjectStampDto | string | null | undefined,
): string | null {
  if (!payload) return null;
  if (typeof payload === "string") return payload.trim() || null;
  return (
    payload.url?.trim() ||
    payload.stamp_url?.trim() ||
    payload.file_url?.trim() ||
    null
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
