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
  const { isLoading, hasBranches } = useLocationDialog();
  const [selectedBranch, setSelectedBranch] = useState("jeddah");
  const [isDefaultLocation, setIsDefaultLocation] = useState(true);
  const [longitude, setLongitude] = useState("25.3253.486.4786.1");
  const [latitude, setLatitude] = useState("25.3253.486.4786.1");

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
        onBranchChange={setSelectedBranch}
      />
      
      <DefaultLocationCheckbox
        isDefaultLocation={isDefaultLocation}
        onChange={setIsDefaultLocation}
      />
      
      <CoordinatesInput
        longitude={longitude}
        latitude={latitude}
        onLongitudeChange={setLongitude}
        onLatitudeChange={setLatitude}
      />
      
      <MapComponent
        selectedBranch={selectedBranch}
        isDefaultLocation={isDefaultLocation}
      />
      
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
