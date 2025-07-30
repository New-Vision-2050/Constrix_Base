"use client";

import { ReactNode } from "react";
import { usePermissions } from "./permissions-provider";
import { CanCheckArguments } from "../can";

interface CanProps {
  check: CanCheckArguments;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * A component wrapper for permission checking using the usePermissions hook.
 *
 * @param check - Permission check parameter(s) - same as the `can` function
 * @param children - Content to render when permission check passes
 * @param fallback - Optional content to render when permission check fails
 *
 * @example
 * ```tsx
 * // Simple permission check
 * <Can check={["read"]}>
 *   <ReadButton />
 * </Can>
 *
 * // With fallback
 * <Can check={["admin"]} fallback={<div>Access denied</div>}>
 *   <AdminPanel />
 * </Can>
 *
 * // AND logic: user needs ALL permissions
 * <Can check={["read", "write"]}>
 *   <EditButton />
 * </Can>
 *
 * // OR logic: user needs ANY permission from array
 * <Can check={[["admin", "moderator"]]}>
 *   <ModeratorTools />
 * </Can>
 *
 * // Combined AND + OR logic
 * <Can check={["read", ["admin", "moderator"]]}>
 *   <AdvancedFeature />
 * </Can>
 *
 * // Custom function check
 * <Can check={[(perms) => perms.length > 0]}>
 *   <UserContent />
 * </Can>
 * ```
 */
export const Can = ({ check, children, fallback = null }: CanProps) => {
  const { can } = usePermissions();

  // Handle the different check formats to match the can function signature
  const hasPermission = can(...check);

  return hasPermission ? <>{children}</> : <>{fallback}</>;
};

export default Can;
