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

// New nested structure types based on API response
// Level 4: Individual permission items (arrays)
export type CategoryPermissions = PermissionWithStatus[];

// Level 3: Sub-categories (like "بيانات", "اتصال", "هوية")
export type SubCategoryPermissions = Record<string, CategoryPermissions>;

// Level 2: Sub-accordions (like "الملف الشخصي للمستخدم", "ملف الشركة")
export type SubAccordionPermissions = Record<string, SubCategoryPermissions>;

// Level 1: Main accordion (like "الإعدادات")
export type MainAccordionPermissions = Record<string, SubAccordionPermissions>;

// Root structure
export type NestedPermissionsData = Record<string, MainAccordionPermissions>;

// API Response structure for lookup
export interface NestedPermissionsRoot {
  payload: NestedPermissionsData;
}

// Package permissions interfaces
export interface PackagePermissionsRoot {
  payload: {
    id: string;
    name: string;
    permissions: NestedPermissionsData;
  };
}

// Legacy types for backward compatibility
export type CategoryData = Record<string, PermissionItem[]>;
export type CategoryPermissionsPayload = Record<string, CategoryData>;
export type PermissionsData = {
  [categoryKey: string]: Record<string, PermissionWithStatus[]>;
};
export interface PackagePermissions {
  [key: string]: Record<string, PermissionWithStatus[]>;
}
