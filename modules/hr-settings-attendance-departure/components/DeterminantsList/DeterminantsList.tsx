import React, { useState } from "react";
import { AttendanceDeterminant } from "../../types/attendance-departure";
import DeterminantItem from "./DeterminantItem";
import { MapPin } from "lucide-react";

interface DeterminantsListProps {
  determinants: AttendanceDeterminant[];
}

/**
 * Component to display a list of attendance determinants
 */
const DeterminantsList: React.FC<DeterminantsListProps> = ({ determinants: initialDeterminants }) => {
  // State to track active determinant
  const [determinants, setDeterminants] = useState(() => {
    // Set the first item as active by default
    return initialDeterminants.map((det, index) => ({
      ...det,
      active: index === 0
    }));
  });

  // Handle determinant click
  const handleDeterminantClick = (id: string) => {
    setDeterminants(prevDeterminants => 
      prevDeterminants.map(det => ({
        ...det,
        active: det.id === id
      }))
    );
  };

  return (
    <div className="bg-[#1A103C] rounded-lg overflow-hidden w-[171px] mx-auto">
      <div className="px-4">
        {determinants.map((determinant) => (
          <DeterminantItem 
            key={determinant.id} 
            determinant={determinant} 
            onClick={handleDeterminantClick}
          />
        ))}
      </div>
    </div>
  );
};

export default DeterminantsList;
