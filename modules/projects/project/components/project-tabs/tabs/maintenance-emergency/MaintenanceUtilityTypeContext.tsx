"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { MaintenanceUtilityType } from "./types/maintenanceUtilityType";

const MaintenanceUtilityTypeContext =
  createContext<MaintenanceUtilityType>("electricity");

export function MaintenanceUtilityTypeProvider({
  type,
  children,
}: {
  type: MaintenanceUtilityType;
  children: ReactNode;
}) {
  return (
    <MaintenanceUtilityTypeContext.Provider value={type}>
      {children}
    </MaintenanceUtilityTypeContext.Provider>
  );
}

export function useMaintenanceUtilityType(): MaintenanceUtilityType {
  return useContext(MaintenanceUtilityTypeContext);
}
