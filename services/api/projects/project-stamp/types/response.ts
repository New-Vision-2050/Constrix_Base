import type { ApiBaseResponse } from "@/types/common/response/base";

export interface ProjectStampDto {
  id?: string | number | null;
  url?: string | null;
  stamp_url?: string | null;
  file_url?: string | null;
  name?: string | null;
  mime_type?: string | null;
  size?: number | null;
}

export type GetProjectStampResponse = ApiBaseResponse<
  ProjectStampDto | string | null
>;

export type UploadProjectStampResponse = ApiBaseResponse<ProjectStampDto>;
