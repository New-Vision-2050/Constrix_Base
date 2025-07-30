import React, { useState } from "react";
import { LocationDialogProvider, useLocationDialog } from "./context/LocationDialogContext";
import DialogHeader from "./components/DialogHeader";
import BranchSelector from "./components/BranchSelector";
import { useTheme } from "next-themes";
import DefaultLocationCheckbox from "./components/DefaultLocationCheckbox";
import CoordinatesInput from "./components/CoordinatesInput";
import MapComponent from "./components/MapComponent";
import SaveButton from "./components/SaveButton";
import LoadingState from "./components/LoadingState";
import NoDataState from "./components/NoDataState";
import { Button } from "@/components/ui/button";
import { Navigation } from "lucide-react";

interface LocationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

// Internal dialog content component
function LocationDialogContent({ onClose }: { onClose: () => void }) {
  // Get current theme
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDarkMode = currentTheme === 'dark';
  
  // Theme-specific colors
  const dialogBg = isDarkMode ? 'bg-[#2A1B3D]' : 'bg-white';
  const dialogBorder = isDarkMode ? '' : 'border border-gray-200';
  const overlayBg = isDarkMode ? 'bg-black bg-opacity-50' : 'bg-gray-700 bg-opacity-40';
  const { isLoading, hasBranches, selectedBranches, getBranchLocation, updateBranchLocation } = useLocationDialog();
  const [selectedBranch, setSelectedBranch] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  
  // Initialize selected branch when branches are available
  React.useEffect(() => {
    if (selectedBranches.length > 0 && !selectedBranch) {
      const firstBranch = selectedBranches[0];
      setSelectedBranch(firstBranch);
      
      // Also initialize currentBranchData with the first branch data
      const branchData = getBranchLocation(firstBranch);
      setCurrentBranchData(branchData);
    }
  }, [selectedBranches, selectedBranch, getBranchLocation]);
  
  // State for current branch location data - avoid undefined values
  const [currentBranchData, setCurrentBranchData] = useState({
    branchId: "",
    isDefault: false,
    latitude: "",
    longitude: "",
    radius: "200",
  });

  // Update currentBranchData when selected branch changes
  React.useEffect(() => {
    if (selectedBranch) {
      const branchData = getBranchLocation(selectedBranch);
      setCurrentBranchData(branchData);
    }
  }, [selectedBranch, getBranchLocation]);
  
  // Handle branch change
  const handleBranchChange = (branchId: string) => {
    setSelectedBranch(branchId);
    // Data will be updated by the useEffect that watches selectedBranch
  };
  
  // Handle default location checkbox change
  const handleDefaultLocationChange = (isDefault: boolean) => {
    if (selectedBranch) {
      if (isDefault) {
        const branchLocation = getBranchLocation(selectedBranch);
        
        // Update branch location in context
        const updatedData = {
          isDefault: true,
          radius: branchLocation.radius ?? "200",
          latitude: branchLocation.latitude,
          longitude: branchLocation.longitude,
        };
        
        // Force refresh from context by querying again - this is important
        // to ensure we're using the correct coordinates from the branch data
        updateBranchLocation(selectedBranch, updatedData);
        
        // Update local state to immediately reflect in UI
        setCurrentBranchData({
          ...currentBranchData,
          ...updatedData
        });
      } else {
        // Update context
        updateBranchLocation(selectedBranch, { isDefault: false });
        
        // Update local state
        setCurrentBranchData({
          ...currentBranchData,
          isDefault: false
        });
      }
    }
  };
  
  // Handle coordinate changes
  const handleCoordinateChange = (
    field: "latitude" | "longitude" | "radius",
    value: string
  ) => {
    if (selectedBranch) {
      // عندما يكون الحقل radius، لا نحتاج لتغيير خاصية isDefault
      // عندما يكون الحقل latitude أو longitude، نضبط isDefault على false
      let updateData: Partial<typeof currentBranchData> = { [field]: value };
      
      if (field !== "radius") {
        // Only change isDefault for latitude/longitude changes
        updateData.isDefault = false;
      }
      
      // Update in context
      updateBranchLocation(selectedBranch, updateData);
      
      // Update local state to immediately reflect in UI
      setCurrentBranchData({
        ...currentBranchData,
        ...updateData
      });
    }
  };
  
  // Handle map click
  const handleMapClick = (latitude: string, longitude: string) => {
    if (selectedBranch) {
      const updateData = {
        latitude,
        longitude,
        isDefault: false, // Uncheck default when selecting from map
      };
      
      // Update in context
      updateBranchLocation(selectedBranch, updateData);
      
      // Update local state to immediately reflect in UI
      setCurrentBranchData({
        ...currentBranchData,
        ...updateData
      });
    }
  };

  // Handle get current location
  const handleGetCurrentLocation = () => {
    if (selectedBranch && navigator.geolocation) {
      setIsGettingLocation(true);
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude.toString();
          const longitude = position.coords.longitude.toString();
          
          const updateData = {
            latitude,
            longitude,
            radius: "200",
            isDefault: false, // Uncheck default when using current location
          };
          
          // Update in context
          updateBranchLocation(selectedBranch, updateData);
          
          // Update local state to immediately reflect in UI
          setCurrentBranchData({
            ...currentBranchData,
            ...updateData
          });
          
          setIsGettingLocation(false);
        },
        (error) => {
          console.error("Error getting current location:", error);
          setIsGettingLocation(false);
          // Could show an error toast or message here
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className={`${dialogBg} ${dialogBorder} rounded-lg p-6 w-full max-w-2xl mx-4 shadow-lg`}>
        <DialogHeader onClose={onClose} />
        <LoadingState />
      </div>
    );
  }

  // Show no data state
  if (!hasBranches) {
    return (
      <div className={`${dialogBg} ${dialogBorder} rounded-lg p-6 w-full max-w-2xl mx-4 shadow-lg`}>
        <DialogHeader onClose={onClose} />
        <NoDataState />
      </div>
    );
  }

  // Show normal dialog content
  return (
    <div className={`${dialogBg} ${dialogBorder} rounded-lg p-6 w-full max-w-2xl mx-4 shadow-lg`}>
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
          radius={currentBranchData.radius}
          onLongitudeChange={(value) => handleCoordinateChange('longitude', value)}
          onLatitudeChange={(value) => handleCoordinateChange('latitude', value)}
          onRadiusChange={(value) => handleCoordinateChange('radius', value)}
          disabled={currentBranchData.isDefault}
        />
        
        <div className="mt-4 mb-4">
          <Button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={isGettingLocation}
            className="w-full"
          >
            <Navigation className="w-4 h-4 ml-2" />
            {isGettingLocation ? "جاري تحديد الموقع..." : "تحديد الموقع الحالي"}
          </Button>
        </div>
        
        <MapComponent
          selectedBranch={selectedBranch || ""}
          isDefaultLocation={!!currentBranchData.isDefault}
          latitude={currentBranchData.latitude || ""}
          longitude={currentBranchData.longitude || ""}
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
  
  // Get current theme
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDarkMode = currentTheme === 'dark';
  
  // Theme-specific overlay
  const overlayBg = isDarkMode ? 'bg-black bg-opacity-50' : 'bg-gray-700 bg-opacity-40';

  return (
    <LocationDialogProvider>
      <div className={`fixed inset-0 ${overlayBg} flex items-center justify-center z-50`}>
        <LocationDialogContent onClose={onClose} />
      </div>
    </LocationDialogProvider>
  );
}
