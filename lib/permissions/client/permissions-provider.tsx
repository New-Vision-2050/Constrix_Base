"use client";

import { createContext, PropsWithChildren, useContext } from "react";
import { Permission } from "../types/permission";
import { createCan } from "../can";

export const PermissionsContext = createContext<{
  permissions: Permission[];
  can: ReturnType<typeof createCan>;
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
}: PropsWithChildren<{ permissions?: Permission[] }>) {
  const can = createCan(permissions || []);
  return (
    <PermissionsContext.Provider
      value={{
        permissions: permissions || [],
        can,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
}

export default PermissionsProvider;
