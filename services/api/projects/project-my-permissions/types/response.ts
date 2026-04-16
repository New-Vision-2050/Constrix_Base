import { ApiBaseResponse } from "@/types/common/response/base";

/** Single permission row; `permission_key` is the short enum (e.g. `PROJECT_EMPLOYEE_VIEW`). */
export interface ProjectMyPermissionFlatItem {
  id: string;
  name: string;
  permission_key: string | null;
  title: string;
  title_ar?: string;
  title_en?: string;
  submodule: string;
  action: string;
}

/**
 * Payload from `GET /projects/{project_id}/my-permissions/flat`
 * (object with nested `permissions`; legacy may return a bare array).
 */
export interface ProjectMyPermissionsFlatPayload {
  project_id: string;
  user_id: string;
  role: {
    id: string;
    name: string;
    slug: string;
  };
  permissions: ProjectMyPermissionFlatItem[];
  permissions_count: number;
}

export type ProjectMyPermissionsFlatResponse = ApiBaseResponse<
  ProjectMyPermissionsFlatPayload | ProjectMyPermissionFlatItem[]
>;
