import { ReactNode, ComponentType } from "react";
import { getPermissions } from "./get-permissions";
import { createCan, CanCheckArguments } from "../can";

interface WithServerPermissionsOptions {
  fallback?: ReactNode;
  strict?: boolean;
}

/**
 * Server-side Higher Order Component that wraps a component with permission checking.
 *
 * @param Component - The component to wrap with permissions
 * @param permissions - Permission check parameter(s) - same as the `can` function
 * @param options - Additional options (fallback, strict)
 * @returns A new async component that only renders if permissions are met
 *
 * @example
 * ```tsx
 * // Simple permission check
 * const ProtectedButton = withServerPermissions(Button, ["admin"]);
 *
 * // With fallback
 * const AdminPanel = withServerPermissions(Panel, ["admin"], {
 *   fallback: <div>Access denied</div>
 * });
 *
 * // Strict checking
 * const StrictAdminPanel = withServerPermissions(Panel, ["admin"], {
 *   strict: true
 * });
 *
 * // Complex permission logic
 * const ModeratorTools = withServerPermissions(ToolsComponent, ["read", ["admin", "moderator"]]);
 * ```
 */
export function withServerPermissions<P extends object>(
  Component: ComponentType<P>,
  permissionsCheck: CanCheckArguments,
  options: WithServerPermissionsOptions = {}
) {
  const WrappedComponent = async (props: P) => {
    const { permissions, isSuperAdmin, isCentralCompany } =
      await getPermissions();

    // Create permission checker functions
    const can = createCan(permissions);
    const strictCan = createCan(
      isSuperAdmin || isCentralCompany ? permissions : "bypass"
    );

    // Handle permission checking based on strict mode
    const hasPermission = options.strict
      ? strictCan(...permissionsCheck)
      : can(...permissionsCheck);

    if (!hasPermission) {
      return options.fallback ? <>{options.fallback}</> : null;
    }

    return <Component {...props} />;
  };

  // Set display name for better debugging
  WrappedComponent.displayName = `withServerPermissions(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
}

export default withServerPermissions;
