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
    latitude: "",
    longitude: "",
    radius: "200"
  };
  
  // Handle branch change
  const handleBranchChange = (branchId: string) => {
    setSelectedBranch(branchId);
  };
  
  // Handle default location checkbox change
  const handleDefaultLocationChange = (isDefault: boolean) => {
    if (selectedBranch) {
      if (isDefault) {
        // استرجاع إحداثيات الفرع الفعلية من السياق
        // هذه الإحداثيات تم الحصول عليها في LocationDialogContext من بيانات الفرع
        // لذلك فهي تعكس الإحداثيات الفعلية للفرع وليست قيم افتراضية ثابتة
        const branchLocation = getBranchLocation(selectedBranch);
        
        updateBranchLocation(selectedBranch, {
          isDefault: true,
          latitude: branchLocation.latitude,
          longitude: branchLocation.longitude,
        });
      } else {
        updateBranchLocation(selectedBranch, { isDefault: false });
      }
    }
  };
  
  // Handle coordinate changes
  const handleCoordinateChange = (field: 'latitude' | 'longitude' | 'radius', value: string) => {
    if (selectedBranch) {
      // عندما يكون الحقل radius، لا نحتاج لتغيير خاصية isDefault
      // عندما يكون الحقل latitude أو longitude، نضبط isDefault على false
      if (field === 'radius') {
        updateBranchLocation(selectedBranch, { 
          [field]: value
        });
      } else {
        updateBranchLocation(selectedBranch, { 
          [field]: value,
          isDefault: false // إلغاء تحديد الموقع الافتراضي عند تغيير الإحداثيات
        });
      }
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
        />
        
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
