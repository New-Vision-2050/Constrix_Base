"use client";

import { ComponentType } from "react";
import { withPermissions } from "./withPermissions";
import { CanCheckArguments } from "../can";
import { NotAuthorized } from "@/components/shared/NotAuthorized";

interface WithPermissionsPageOptions {
  notAuthorizedTitle?: string;
  notAuthorizedMessage?: string;
  showHomeLink?: boolean;
  showBackButton?: boolean;
  strict?: boolean;
}

/**
 * Higher Order Component that wraps a page component with permission checking
 * and shows a NotAuthorized page when permissions are not met.
 *
 * @param Component - The page component to wrap with permissions
 * @param permissions - Permission check parameter(s) - same as the `can` function
 * @param options - Additional options for customizing the not authorized page
 * @returns A new component that only renders the page if permissions are met
 *
 * @example
 * ```tsx
 * // Simple permission check
 * const ProtectedAdminPage = withPermissionsPage(AdminDashboard, ["admin"]);
 *
 * // With custom not authorized message
 * const UserManagementPage = withPermissionsPage(UserManagement, ["user.view"], {
 *   notAuthorizedTitle: "User Management Access Required",
 *   notAuthorizedMessage: "You need user management permissions to access this page"
 * });
 *
 * // Strict checking without home/back buttons
 * const SuperAdminPage = withPermissionsPage(SuperAdmin, ["super_admin"], {
 *   strict: true,
 *   showHomeLink: false,
 *   showBackButton: false
 * });
 *
 * // Complex permission logic
 * const ModeratorPage = withPermissionsPage(ModeratorTools, ["moderate", ["admin", "moderator"]]);
 * ```
 */
export function withPermissionsPage<P extends object>(
  Component: ComponentType<P>,
  permissions: CanCheckArguments,
  options: WithPermissionsPageOptions = {}
) {
  const notAuthorizedFallback = (
    <NotAuthorized
      title={options.notAuthorizedTitle}
      message={options.notAuthorizedMessage}
      showHomeLink={options.showHomeLink}
      showBackButton={options.showBackButton}
    />
  );

  const WrappedComponent = withPermissions(Component, permissions, {
    fallback: notAuthorizedFallback,
    ...options,
  });

  // Set display name for better debugging
  WrappedComponent.displayName = `withPermissionsPage(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
}

export default withPermissionsPage;
