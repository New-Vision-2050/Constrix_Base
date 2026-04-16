import { ApiBaseResponse } from "@/types/common/response/base";

export interface ProjectPermission {
  id: string;
  key: string;
  submodule: string;
  action: string;
  type: string;
  name: string;
  title_ar: string;
  title_en: string;
}

export type ProjectPermissionsTree = Record<
  string,
  Record<string, ProjectPermission[]>
>;

export type ProjectPermissionsTreeResponse =
  ApiBaseResponse<ProjectPermissionsTree>;

export interface ProjectRoleListItem {
  id: string;
  project_id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  is_default: boolean;
  permissions_count: number;
  permissions: ProjectPermissionsTree | [];
  created_at: string;
}

export type ProjectRolesListResponse = ApiBaseResponse<ProjectRoleListItem[]>;

export type ProjectRoleDetailsResponse =
  ApiBaseResponse<ProjectPermissionsTree>;

export interface ProjectRoleDeleteResponse {
  success: boolean;
  message: string;
}
