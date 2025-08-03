"use client";

import { ReactNode, ComponentType } from "react";
import { Can } from "./Can";
import { CanCheckArguments } from "../can";

interface WithPermissionsOptions {
  fallback?: ReactNode;
  strict?: boolean;
}

/**
 * Higher Order Component that wraps a component with permission checking.
 *
 * @param Component - The component to wrap with permissions
 * @param permissions - Permission check parameter(s) - same as the `can` function
 * @param options - Additional options (fallback, strict)
 * @returns A new component that only renders if permissions are met
 *
 * @example
 * ```tsx
 * // Simple permission check
 * const ProtectedButton = withPermissions(Button, ["admin"]);
 *
 * // With fallback
 * const AdminPanel = withPermissions(Panel, ["admin"], {
 *   fallback: <div>Access denied</div>
 * });
 *
 * // Strict checking
 * const StrictAdminPanel = withPermissions(Panel, ["admin"], {
 *   strict: true
 * });
 *
 * // Complex permission logic
 * const ModeratorTools = withPermissions(ToolsComponent, ["read", ["admin", "moderator"]]);
 * ```
 */
export function withPermissions<P extends object>(
  Component: ComponentType<P>,
  permissions: CanCheckArguments,
  options: WithPermissionsOptions = {}
) {
  const WrappedComponent = (props: P) => {
    return (
      <Can
        check={permissions}
        fallback={options.fallback}
        strict={options.strict}
      >
        <Component {...props} />
      </Can>
    );
  };

  // Set display name for better debugging
  WrappedComponent.displayName = `withPermissions(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
}

export default withPermissions;
