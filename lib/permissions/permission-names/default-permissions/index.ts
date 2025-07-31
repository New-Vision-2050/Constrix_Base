// Available permission actions
const PERMISSION_ACTIONS = [
  "EXPORT",
  "UPDATE",
  "LIST",
  "DELETE",
  "VIEW",
  "CREATE",
  "ACTIVATE",
] as const;

type PermissionAction = (typeof PERMISSION_ACTIONS)[number];

// Helper type to create permission key
type CreatePermissionKey<T extends string, A extends string> = `${T}_${A}`;

// Type for when no actions are specified (returns all actions)
type AllActionsResult<T extends string> = {
  [K in PermissionAction as `${Lowercase<K>}`]: CreatePermissionKey<T, K>;
};

// Type for when specific actions are specified
type SpecificActionsResult<
  T extends string,
  A extends readonly PermissionAction[]
> = {
  [K in A[number] as `${Lowercase<K>}`]: CreatePermissionKey<T, K>;
};

/**
 * Creates permission keys based on a permission name and optional actions.
 *
 * @param permissionName - The base permission name (e.g., "ORGANIZATION_MANAGEMENT", "PROFILE_FAMILY_INFO")
 * @param include - Optional array of actions to include. If not provided, returns all actions.
 * @returns Object with permission keys
 *
 * @example
 * ```typescript
 * // Get specific permissions
 * const orgPerms = createPermissions("ORGANIZATION_MANAGEMENT", ["EXPORT", "VIEW"]);
 * // Returns: { export: "ORGANIZATION_MANAGEMENT_EXPORT", view: "ORGANIZATION_MANAGEMENT_VIEW" }
 *
 * // Get all permissions
 * const profilePerms = createPermissions("PROFILE_FAMILY_INFO");
 * // Returns: {
 * //   export: "PROFILE_FAMILY_INFO_EXPORT",
 * //   update: "PROFILE_FAMILY_INFO_UPDATE",
 * //   list: "PROFILE_FAMILY_INFO_LIST",
 * //   delete: "PROFILE_FAMILY_INFO_DELETE",
 * //   view: "PROFILE_FAMILY_INFO_VIEW",
 * //   create: "PROFILE_FAMILY_INFO_CREATE",
 * //   activate: "PROFILE_FAMILY_INFO_ACTIVATE"
 * // }
 * ```
 */
export function createPermissions<T extends string>(
  permissionName: T
): AllActionsResult<T>;

export function createPermissions<
  T extends string,
  A extends readonly PermissionAction[]
>(permissionName: T, include: A): SpecificActionsResult<T, A>;

export function createPermissions<T extends string>(
  permissionName: T,
  include?: readonly PermissionAction[]
) {
  const actionsToUse = include || PERMISSION_ACTIONS;

  const result: Record<string, string> = {};

  for (const action of actionsToUse) {
    const key = action.toLowerCase();
    const value = `${permissionName}_${action}` as const;
    result[key] = value;
  }

  return result;
}

// Export the permission actions for external use
export { PERMISSION_ACTIONS };
export type { PermissionAction };
