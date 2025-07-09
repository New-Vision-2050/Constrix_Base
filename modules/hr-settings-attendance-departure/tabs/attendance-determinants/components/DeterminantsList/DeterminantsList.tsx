import React from "react";
import DeterminantItem from "./DeterminantItem/DeterminantItem";
import { MapPin } from "lucide-react";
import { Constraint } from "../../../../types/constraint-type";

interface DeterminantsListProps {
  determinants: Constraint[];
  onClick: (id: string) => void;
}

/**
 * Component to display a list of attendance determinants
 * Puede recibir props directamente o usar el contexto
 */
const DeterminantsList: React.FC<DeterminantsListProps> = ({ determinants, onClick }) => {
  // También podemos acceder al contexto si es necesario
  // const { determinants: contextDeterminants, handleDeterminantClick } = useAttendanceDeterminants();
  return (
    <div className="bg-[#1A103C] rounded-lg overflow-hidden  mx-auto">
      <div 
        className="flex items-center gap-3 px-4 py-3 border-b border-purple-800/30 cursor-pointer hover:bg-[#2A204C] transition-colors"
        onClick={() => onClick("all-determinants")}
      >
        <MapPin size={16} className="text-white" />
        <div className="text-white text-sm font-medium">جميع المحددات</div>
      </div>
      <div className="px-4">
        {determinants.map((determinant) => (
          <DeterminantItem 
            key={determinant.id} 
            determinant={determinant} 
            onClick={onClick}
          />
        ))}
      </div>
    </div>
  );
};

export default DeterminantsList;
