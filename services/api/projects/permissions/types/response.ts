export interface Permission {
  id: string;
  key: string;
  type: string;
  name: string;
}

export interface PermissionCategory {
  [subcategory: string]: Permission[];
}

export interface ProjectPermissionsData {
  project_id: string;
  user_id: string;
  role: {
    id: string;
    name: string;
    slug: string;
  };
  permissions: {
    [category: string]: PermissionCategory;
  };
  permissions_count: number;
}

export interface GetProjectPermissionsResponse {
  success: boolean;
  data: ProjectPermissionsData;
}
