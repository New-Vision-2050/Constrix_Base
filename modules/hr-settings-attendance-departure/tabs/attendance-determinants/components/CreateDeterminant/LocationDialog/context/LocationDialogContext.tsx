import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useFormInstance } from "@/modules/form-builder/hooks/useFormStore";
import { useAttendanceDeterminants } from "@/modules/hr-settings-attendance-departure/tabs/attendance-determinants/context/AttendanceDeterminantsContext";
import { Branch } from "@/modules/user-profile/types/branch";

// Branch location data interface
interface BranchLocationData {
  branchId: string;
  isDefault: boolean;
  latitude: string;
  longitude: string;
  radius: string;
}

interface LocationDialogContextType {
  selectedBranches: string[];
  isLoading: boolean;
  hasBranches: boolean;
  branchesMap: Record<string, string>;
  branchLocations: Record<string, BranchLocationData>;
  updateBranchLocation: (
    branchId: string,
    data: Partial<BranchLocationData>,
  ) => void;
  getBranchLocation: (branchId: string) => BranchLocationData;
}

const LocationDialogContext = createContext<
  LocationDialogContextType | undefined
>(undefined);

interface LocationDialogProviderProps {
  children: ReactNode;
}

export function LocationDialogProvider({
  children,
}: LocationDialogProviderProps) {
  const { values } = useFormInstance("create-determinant-form", {});
  const selectedBranches = values.branch_ids || [];
  const { branchesData } = useAttendanceDeterminants();

  // State for branch mapping
  const [branchesMap, setBranchesMap] = useState<Record<string, string>>({});
  const [defaultCoordinates, setDefaultCoordinates] = useState<
    Record<string, { latitude: string; longitude: string; radius: string }>
  >({});

  // Update branches data when branchesData changes
  useEffect(() => {
    if (branchesData && branchesData.length > 0) {
      // Create dynamic branch mapping
      const newBranchesMap: Record<string, string> = {};
      const newDefaultCoordinates: Record<
        string,
        { latitude: string; longitude: string; radius: string }
      > = {};

      branchesData.forEach((branch: Branch) => {
        if (branch.id) {
          // Add to branch map
          newBranchesMap[branch.id] = branch.name || `فرع ${branch.id}`;

          // Add coordinates with defaults if missing
          newDefaultCoordinates[branch.id] = {
            latitude: branch.latitude || "24.7136",
            longitude: branch.longitude || "46.6753",
            radius: "100", // Default radius since it's not in Branch type
          };
        }
      });

      setBranchesMap(newBranchesMap);
      setDefaultCoordinates(newDefaultCoordinates);
    }
  }, [branchesData]);

  // State for branch locations
  const [branchLocations, setBranchLocations] = useState<
    Record<string, BranchLocationData>
  >({});

  // Loading state when form data is not available yet
  const isLoading = !values;

  // Check if branches are selected
  const hasBranches = selectedBranches && selectedBranches.length > 0;

  // Initialize branch locations from form values if in edit mode
  useEffect(() => {
    if (values.branch_locations) {
      const existingLocations: Record<string, BranchLocationData> = {};

      let locationsArray: any[] = [];
      if (typeof values.branch_locations === "string") {
        try {
          locationsArray = JSON.parse(values.branch_locations);
        } catch {
          locationsArray = [];
        }
      } else if (Array.isArray(values.branch_locations)) {
        locationsArray = values.branch_locations;
      } else if (typeof values.branch_locations === "object") {
        locationsArray = Object.values(values.branch_locations);
      }

      locationsArray.forEach((locationData: any) => {
        if (locationData) {
          const branchId = locationData.branch_id || locationData.branchId;
          if (branchId) {
            existingLocations[branchId] = {
              branchId,
              isDefault:
                locationData.is_default ??
                locationData.isDefaultLocation ??
                false,
              latitude: locationData.latitude?.toString() || "",
              longitude: locationData.longitude?.toString() || "",
              radius: locationData.radius?.toString() || "100",
            };
          }
        }
      });

      if (Object.keys(existingLocations).length > 0) {
        setBranchLocations(existingLocations);
      }
    }
  }, [values.branch_locations]);

  // Update branch location data
  const updateBranchLocation = (
    branchId: string,
    data: Partial<BranchLocationData>,
  ) => {
    // If isDefault is true, we need to use the default coordinates from defaultCoordinates
    if (data.isDefault === true) {
      const branchDefaults = defaultCoordinates[branchId] || {
        latitude: "24.7136",
        longitude: "46.6753",
        radius: "100",
      };

      // Update with default coordinates when isDefault is true
      setBranchLocations((prev) => ({
        ...prev,
        [branchId]: {
          ...prev[branchId],
          branchId,
          isDefault: true,
          latitude: branchDefaults.latitude,
          longitude: branchDefaults.longitude,
          radius: branchDefaults.radius,
        },
      }));
    } else {
      setBranchLocations((prev) => ({
        ...prev,
        [branchId]: {
          ...prev[branchId],
          branchId,
          ...data,
        },
      }));
    }
  };

  // Get branch location data with defaults
  const getBranchLocation = (branchId: string): BranchLocationData => {
    if (branchLocations[branchId]) {
      return branchLocations[branchId];
    }

    const defaults = defaultCoordinates[branchId] || {
      latitude: "24.7136",
      longitude: "46.6753",
      radius: "100",
    };
    return {
      branchId,
      isDefault: true,
      latitude: defaults.latitude,
      longitude: defaults.longitude,
      radius: defaults.radius,
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
    throw new Error(
      "useLocationDialog must be used within a LocationDialogProvider",
    );
  }
  return context;
}
