export interface ProjectRoleRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  is_default: boolean;
  permissions_count: number;
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
