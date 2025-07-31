import { isDevelopment } from "@/utils/is-development";
import { Permission } from "./types/permission";

type CheckForType = string | ((permissions: Permission[]) => boolean);

export type CanCheckArguments = (CheckForType | CheckForType[])[];

/**
 * Creates a permission checking function that supports AND/OR logic.
 *
 * @param permissions - Array of user permissions
 * @returns A function that checks if user has required permissions
 *
 * @example
 * ```typescript
 * const userPermissions = [{ key: "read" }, { key: "write" }, { key: "admin" }];
 * const can = createCan(userPermissions);
 *
 * // Check single permission
 * can("read") // true
 * can("delete") // false
 *
 * // AND logic: user needs ALL permissions
 * can("read", "write") // true (has both)
 * can("read", "delete") // false (missing delete)
 *
 * // OR logic: user needs ANY permission from array
 * can(["admin", "moderator"]) // true (has admin)
 * can(["delete", "ban"]) // false (has neither)
 *
 * // Combined AND + OR logic
 * can("read", ["admin", "moderator"]) // true (has read AND admin)
 * can("delete", ["admin", "moderator"]) // false (missing delete)
 *
 * // Custom function checks
 * can((perms) => perms.length > 2) // true (has 3 permissions)
 * can("read", (perms) => perms.some(p => p.key.startsWith("admin"))) // true
 * ```
 */
export const createCan =
  (permissions: Permission[] | "bypass") =>
  (...checkFor: CanCheckArguments): boolean => {
    function checkForItem(check: CheckForType): boolean {
      // bypass all permissions if dev bypass is enabled
      if (
        permissions === "bypass" ||
        (isDevelopment &&
          process.env.NEXT_PUBLIC_DEV_BYPASS_ANY_PERMISSION === "true")
      )
        return true;
      switch (typeof check) {
        case "string":
          return permissions.some((p) => p.key === check);
        case "function":
          return check(permissions);
        default:
          throw new Error(
            `Unsupported type for permission check: ${typeof check}`
          );
      }
    }
    return checkFor.every((check) => {
      if (Array.isArray(check)) {
        return check.some(checkForItem);
      } else {
        return checkForItem(check);
      }
    });
  };
