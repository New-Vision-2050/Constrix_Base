import { ReactNode } from "react";
import { getPermissions } from "./get-permissions";
import { createCan, CanCheckArguments } from "../can";

interface ServerCanProps {
  check: CanCheckArguments;
  children: ReactNode;
  fallback?: ReactNode;
  strict?: boolean; // Optional prop to enforce strict permission checking
}

/**
 * A server-side component wrapper for permission checking.
 *
 * @param check - Permission check parameter(s) - same as the `can` function
 * @param children - Content to render when permission check passes
 * @param fallback - Optional content to render when permission check fails
 * @param strict - Optional prop to enforce strict permission checking
 *
 * @example
 * ```tsx
 * // Simple permission check
 * <ServerCan check={["read"]}>
 *   <ReadButton />
 * </ServerCan>
 *
 * // With fallback
 * <ServerCan check={["admin"]} fallback={<div>Access denied</div>}>
 *   <AdminPanel />
 * </ServerCan>
 *
 * // AND logic: user needs ALL permissions
 * <ServerCan check={["read", "write"]}>
 *   <EditButton />
 * </ServerCan>
 *
 * // OR logic: user needs ANY permission from array
 * <ServerCan check={[["admin", "moderator"]]}>
 *   <ModeratorTools />
 * </ServerCan>
 *
 * // Combined AND + OR logic
 * <ServerCan check={["read", ["admin", "moderator"]]}>
 *   <AdvancedFeature />
 * </ServerCan>
 *
 * // Custom function check
 * <ServerCan check={[(perms) => perms.length > 0]}>
 *   <UserContent />
 * </ServerCan>
 *
 * // Strict mode
 * <ServerCan check={["admin"]} strict={true}>
 *   <StrictAdminPanel />
 * </ServerCan>
 * ```
 */
export const ServerCan = async ({
  check,
  children,
  fallback = null,
  strict,
}: ServerCanProps) => {
  const { permissions, isSuperAdmin, isCentralCompany } =
    await getPermissions();

  // Create permission checker functions
  const can = createCan(permissions);
  const strictCan = createCan(
    isSuperAdmin || isCentralCompany ? permissions : "bypass"
  );

  // Handle the different check formats to match the can function signature
  const hasPermission = strict ? strictCan(...check) : can(...check);

  return hasPermission ? <>{children}</> : <>{fallback}</>;
};

export default ServerCan;
