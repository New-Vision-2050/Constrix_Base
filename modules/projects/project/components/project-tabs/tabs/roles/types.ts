import type { ProjectPermissionsTree } from "@/services/api/projects/project-roles/types/response";

export interface ProjectRoleRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  is_default: boolean;
  permissions_count: number;
  permissions: ProjectPermissionsTree | [];
  created_at: string;
}

export interface PermissionRow {
  id: string;
  category: string;
  subcategory: string;
  name: string;
  type: string;
  key: string;
}
