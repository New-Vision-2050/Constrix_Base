"use client";

import { createContext, PropsWithChildren, useContext } from "react";
import { Permission } from "../types/permission";
import { createCan } from "../can";

export const PermissionsContext = createContext<{
  permissions: Permission[];
  isSuperAdmin: boolean;
  isCentralCompany: boolean;
  can: ReturnType<typeof createCan>;
  strictCan: ReturnType<typeof createCan>;
} | null>(null);

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }
  return context;
};

function PermissionsProvider({
  children,
  permissions,
  isSuperAdmin = false,
  isCentralCompany = false,
}: PropsWithChildren<{
  permissions?: Permission[];
  isSuperAdmin?: boolean;
  isCentralCompany?: boolean;
}>) {
  const can = createCan(isSuperAdmin ? "bypass" : permissions || []);
  const strictCan = createCan(permissions || []);
  return (
    <PermissionsContext.Provider
      value={{
        permissions: permissions || [],
        can,
        strictCan,
        isSuperAdmin,
        isCentralCompany,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
}

export default PermissionsProvider;
