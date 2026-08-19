import type { ApiBaseResponse } from "@/types/common/response/base";

export interface ProjectStampDto {
  id?: string | number | null;
  url?: string | null;
  stamp_url?: string | null;
  file_url?: string | null;
  image_url?: string | null;
  original_url?: string | null;
  preview_url?: string | null;
  full_url?: string | null;
  path?: string | null;
  file_path?: string | null;
  stamp?: string | ProjectStampDto | null;
  file?: string | ProjectStampDto | null;
  media?: string | ProjectStampDto | null;
  name?: string | null;
  mime_type?: string | null;
  size?: number | null;
}

export type GetProjectStampResponse = ApiBaseResponse<
  ProjectStampDto | string | null
>;

export type UploadProjectStampResponse = ApiBaseResponse<
  ProjectStampDto | string | null
>;
