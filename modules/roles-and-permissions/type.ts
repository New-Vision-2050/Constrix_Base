export type PermissionItem = {
  id: string;
  key: string;
  type: string;
  name: string;
  is_active: boolean;
};

export type PermissionsGroup = {
  [subEntity: string]: PermissionItem[];
};

export type PermissionsObject = {
  [entity: string]: PermissionsGroup;
};

export type RolePermissions = {
  id?: string;
  name?: string;
  permissions: PermissionsObject;
};

