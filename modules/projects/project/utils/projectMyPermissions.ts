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

function isArchiveLibraryPermission(p: ProjectMyPermissionFlatItem): boolean {
  const k = p.permission_key ?? "";
  if (k) {
    return (
      k.startsWith("PROJECT_ARCHIVE_") && !k.startsWith("PROJECT_ARCHIVE_CYCLE_")
    );
  }
  return p.submodule === "archive-library";
}

/** True if the user has any project permission for the attachments (archive library) tab. */
export function hasAnyAttachmentsTabPermission(
  flat: ProjectMyPermissionFlatItem[] | undefined,
): boolean {
  if (!flat?.length) return false;
  return flat.some((p) => isArchiveLibraryPermission(p));
}

/** True if the user has any project permission for the staff (employee) tab. */
export function hasAnyStaffTabPermission(
  flat: ProjectMyPermissionFlatItem[] | undefined,
): boolean {
  if (!flat?.length) return false;
  return flat.some((p) => {
    const k = p.permission_key ?? "";
    if (k.startsWith("PROJECT_EMPLOYEE_")) return true;
    return p.submodule === "employee";
  });
}

/** True if the user has any project permission for the document cycle (archive cycle) tab. */
export function hasAnyDocumentCycleTabPermission(
  flat: ProjectMyPermissionFlatItem[] | undefined,
): boolean {
  if (!flat?.length) return false;
  return flat.some((p) => {
    const k = p.permission_key ?? "";
    if (k.startsWith("PROJECT_ARCHIVE_CYCLE_")) return true;
    return p.submodule === "archive-cycle";
  });
}

/** True if the user has any project permission for the roles tab. */
export function hasAnyRolesTabPermission(
  flat: ProjectMyPermissionFlatItem[] | undefined,
): boolean {
  if (!flat?.length) return false;
  return flat.some((p) => {
    const k = p.permission_key ?? "";
    if (k.startsWith("PROJECT_ROLE_")) return true;
    return p.submodule === "role";
  });
}
