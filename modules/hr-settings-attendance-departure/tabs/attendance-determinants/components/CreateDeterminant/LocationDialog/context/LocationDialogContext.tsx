import React, { createContext, useContext, ReactNode, useState } from "react";
import { useFormInstance } from "@/modules/form-builder/hooks/useFormStore";

// Branch location data interface
interface BranchLocationData {
  branchId: string;
  isDefault: boolean;
  latitude: string;
  longitude: string;
}

interface LocationDialogContextType {
  selectedBranches: string[];
  isLoading: boolean;
  hasBranches: boolean;
  branchesMap: Record<string, string>;
  branchLocations: Record<string, BranchLocationData>;
  updateBranchLocation: (branchId: string, data: Partial<BranchLocationData>) => void;
  getBranchLocation: (branchId: string) => BranchLocationData;
}

const LocationDialogContext = createContext<LocationDialogContextType | undefined>(undefined);

interface LocationDialogProviderProps {
  children: ReactNode;
}

export function LocationDialogProvider({ children }: LocationDialogProviderProps) {
  const { values } = useFormInstance("create-determinant-form", {});
  const selectedBranches = values.branch_ids || [];
  
  // Available branches mapping with default coordinates
  const branchesMap: Record<string, string> = {
    "riyadh": "فرع الرياض",
    "jeddah": "فرع جدة",
  };
  
  // Default coordinates for each branch
  const defaultCoordinates: Record<string, { latitude: string; longitude: string }> = {
    "riyadh": { latitude: "24.7136", longitude: "46.6753" },
    "jeddah": { latitude: "21.4858", longitude: "39.1925" },
  };
  
  // State for branch locations
  const [branchLocations, setBranchLocations] = useState<Record<string, BranchLocationData>>({});
  
  // Loading state when form data is not available yet
  const isLoading = !values;
  
  // Check if branches are selected
  const hasBranches = selectedBranches && selectedBranches.length > 0;
  
  // Update branch location data
  const updateBranchLocation = (branchId: string, data: Partial<BranchLocationData>) => {
    setBranchLocations(prev => ({
      ...prev,
      [branchId]: {
        ...prev[branchId],
        branchId,
        ...data,
      }
    }));
  };
  
  // Get branch location data with defaults
  const getBranchLocation = (branchId: string): BranchLocationData => {
    if (branchLocations[branchId]) {
      return branchLocations[branchId];
    }
    
    // Return default data for branch
    const defaults = defaultCoordinates[branchId] || { latitude: "24.7136", longitude: "46.6753" };
    return {
      branchId,
      isDefault: true,
      latitude: defaults.latitude,
      longitude: defaults.longitude,
    };
  };

  const contextValue: LocationDialogContextType = {
    selectedBranches,
    isLoading,
    hasBranches,
    branchesMap,
    branchLocations,
    updateBranchLocation,
    getBranchLocation,
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
