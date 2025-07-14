// Base permission item from API
export interface PermissionItem {
  id: string;
  key: string;
  name: string;
  type: string;
}

// Permission item with status (used in package permissions)
export interface PermissionWithStatus {
  id: string;
  key: string;
  type: string;
  name: string;
  is_active: boolean;
  limit?: number;
}

// Category data from lookup API
export type CategoryData = Record<string, PermissionItem[]>;

// Category permissions for package permissions
export type CategoryPermissions = {
  [subKey: string]: PermissionWithStatus[];
};

// Main payload types
export type Payload = Record<string, CategoryData>;

export type PermissionsData = {
  [categoryKey: string]: CategoryPermissions;
};

// Package permissions interfaces
export interface Root {
  payload: {
    id: string;
    name: string;
    permissions: PermissionsData;
  };
}

export interface Permissions {
  [key: string]: CategoryPermissions;
}
