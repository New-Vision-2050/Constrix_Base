import type {
  ProjectMyPermissionFlatItem,
  ProjectMyPermissionsFlatPayload,
} from "@/services/api/projects/project-my-permissions/types/response";

/** Normalizes API payload: object with `permissions` or legacy flat array. */
export function toProjectMyPermissionsFlatList(
  payload:
    | ProjectMyPermissionsFlatPayload
    | ProjectMyPermissionFlatItem[]
    | null
    | undefined,
): ProjectMyPermissionFlatItem[] {
  if (payload == null) return [];
  if (Array.isArray(payload)) return payload;
  return Array.isArray(payload.permissions) ? payload.permissions : [];
}

/**
 * True if the user has a permission whose `permission_key` matches, or whose
 * legacy `name` (full dotted key) matches.
 */
export function hasProjectPermissionKey(
  flat: ProjectMyPermissionFlatItem[] | undefined,
  permissionKey: string,
): boolean {
  if (!flat?.length) return false;
  return flat.some(
    (p) =>
      (p.permission_key != null && p.permission_key === permissionKey) ||
      p.name === permissionKey,
  );
}

export function hasAnyProjectPermissionKey(
  flat: ProjectMyPermissionFlatItem[] | undefined,
  permissionKeys: string[],
): boolean {
  if (!flat?.length || !permissionKeys.length) return false;
  return permissionKeys.some((key) => hasProjectPermissionKey(flat, key));
}
