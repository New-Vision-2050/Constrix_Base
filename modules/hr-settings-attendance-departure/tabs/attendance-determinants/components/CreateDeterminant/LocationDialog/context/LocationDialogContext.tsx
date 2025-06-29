import React, { createContext, useContext, ReactNode } from "react";
import { useFormInstance } from "@/modules/form-builder/hooks/useFormStore";

interface LocationDialogContextType {
  selectedBranches: string[];
  isLoading: boolean;
  hasBranches: boolean;
  branchesMap: Record<string, string>;
}

const LocationDialogContext = createContext<LocationDialogContextType | undefined>(undefined);

interface LocationDialogProviderProps {
  children: ReactNode;
}

export function LocationDialogProvider({ children }: LocationDialogProviderProps) {
  const { values } = useFormInstance("create-determinant-form", {});
  const selectedBranches = values.branches || [];
  
  // Available branches mapping
  const branchesMap: Record<string, string> = {
    "riyadh": "فرع الرياض",
    "jeddah": "فرع جدة",
  };
  
  // Loading state when form data is not available yet
  const isLoading = !values;
  
  // Check if branches are selected
  const hasBranches = selectedBranches && selectedBranches.length > 0;

  const contextValue: LocationDialogContextType = {
    selectedBranches,
    isLoading,
    hasBranches,
    branchesMap,
  };

  return (
    <LocationDialogContext.Provider value={contextValue}>
      {children}
    </LocationDialogContext.Provider>
  );
}

export function useLocationDialog() {
  const context = useContext(LocationDialogContext);
  if (context === undefined) {
    throw new Error("useLocationDialog must be used within a LocationDialogProvider");
  }
  return context;
}
