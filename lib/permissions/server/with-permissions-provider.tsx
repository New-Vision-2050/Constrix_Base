import React from "react";
import PermissionsProvider from "../client/permissions-provider";
import { getPermissions } from "./get-permissions";

function withPermissionsProvider<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return async function DataProviderHOC(props: P) {
    // Use cached permissions function
    const { permissions, isSuperAdmin, isCentralCompany } =
      await getPermissions();

    return (
      <PermissionsProvider
        permissions={permissions}
        isSuperAdmin={isSuperAdmin}
        isCentralCompany={isCentralCompany}
      >
        <WrappedComponent {...props} />
      </PermissionsProvider>
    );
  };
}

export default withPermissionsProvider;
