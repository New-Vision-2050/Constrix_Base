import React, { useState } from "react";
import { LocationDialogProvider, useLocationDialog } from "./context/LocationDialogContext";
import DialogHeader from "./components/DialogHeader";
import BranchSelector from "./components/BranchSelector";
import DefaultLocationCheckbox from "./components/DefaultLocationCheckbox";
import CoordinatesInput from "./components/CoordinatesInput";
import MapComponent from "./components/MapComponent";
import SaveButton from "./components/SaveButton";
import LoadingState from "./components/LoadingState";
import NoDataState from "./components/NoDataState";

interface LocationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

// Internal dialog content component
function LocationDialogContent({ onClose }: { onClose: () => void }) {
  const { isLoading, hasBranches, selectedBranches, getBranchLocation, updateBranchLocation } = useLocationDialog();
  const [selectedBranch, setSelectedBranch] = useState("");
  
  // Initialize selected branch when branches are available
  React.useEffect(() => {
    if (selectedBranches.length > 0 && !selectedBranch) {
      setSelectedBranch(selectedBranches[0]);
    }
  }, [selectedBranches, selectedBranch]);
  
  // Get current branch location data - always provide default values to avoid undefined
  const currentBranchData = selectedBranch ? getBranchLocation(selectedBranch) : {
    branchId: "",
    isDefault: false,
    latitude: "24.7136", // Default to Riyadh coordinates
    longitude: "46.6753",
    radius: "100"
  };
  
  // Handle branch change
  const handleBranchChange = (branchId: string) => {
    setSelectedBranch(branchId);
  };
  
  // Handle default location checkbox change
  const handleDefaultLocationChange = (isDefault: boolean) => {
    if (selectedBranch) {
      if (isDefault) {
        // Reset to default coordinates when checking default location
        const defaultCoordinates = {
          "riyadh": { latitude: "24.7136", longitude: "46.6753", radius: "100" },
          "jeddah": { latitude: "21.4858", longitude: "39.1925", radius: "100" },
        };
        
        const defaults = defaultCoordinates[selectedBranch as keyof typeof defaultCoordinates] || 
                        { latitude: "24.7136", longitude: "46.6753", radius: "100" };
        
        updateBranchLocation(selectedBranch, {
          isDefault: true,
          latitude: defaults.latitude,
          longitude: defaults.longitude,
        });
      } else {
        updateBranchLocation(selectedBranch, { isDefault: false });
      }
    }
  };
  
  // Handle coordinate changes
  const handleCoordinateChange = (field: 'latitude' | 'longitude' | 'radius', value: string) => {
    if (selectedBranch) {
      updateBranchLocation(selectedBranch, { 
        [field]: value,
        isDefault: field !== 'radius' ? false : undefined // Uncheck default only when changing lat/lng
      });
    }
  };
  
  // Handle map click
  const handleMapClick = (latitude: string, longitude: string) => {
    if (selectedBranch) {
      updateBranchLocation(selectedBranch, {
        latitude,
        longitude,
        isDefault: false // Uncheck default when selecting from map
      });
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-[#2A1B3D] rounded-lg p-6 w-full max-w-2xl mx-4">
        <DialogHeader onClose={onClose} />
        <LoadingState />
      </div>
    );
  }

  // Show no data state
  if (!hasBranches) {
    return (
      <div className="bg-[#2A1B3D] rounded-lg p-6 w-full max-w-2xl mx-4">
        <DialogHeader onClose={onClose} />
        <NoDataState />
      </div>
    );
  }

  // Show normal dialog content
  return (
    <div className="bg-[#2A1B3D] rounded-lg p-6 w-full max-w-2xl mx-4">
      <DialogHeader onClose={onClose} />
      
      <BranchSelector
        selectedBranch={selectedBranch}
        onBranchChange={handleBranchChange}
      />
      
      {/* Always render the components but ensure we never pass undefined values */}
      <>
        <DefaultLocationCheckbox
          isDefaultLocation={currentBranchData.isDefault}
          onChange={handleDefaultLocationChange}
        />
        
        <CoordinatesInput
          longitude={currentBranchData.longitude || ""}
          latitude={currentBranchData.latitude || ""}
          radius={currentBranchData.radius || "100"}
          onLongitudeChange={(value) => handleCoordinateChange('longitude', value)}
          onLatitudeChange={(value) => handleCoordinateChange('latitude', value)}
          onRadiusChange={(value) => handleCoordinateChange('radius', value)}
        />
        
        <MapComponent
          selectedBranch={selectedBranch || ""}
          isDefaultLocation={!!currentBranchData.isDefault}
          latitude={currentBranchData.latitude || "24.7136"}
          longitude={currentBranchData.longitude || "46.6753"}
          onMapClick={handleMapClick}
        />
      </>
      
      <SaveButton onSave={onClose} />
    </div>
  );
}

export default function LocationDialog({
  isOpen,
  onClose,
}: LocationDialogProps) {
  if (!isOpen) return null;

  return (
    <LocationDialogProvider>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <LocationDialogContent onClose={onClose} />
      </div>
    </LocationDialogProvider>
  );
}
