import React from "react";
import DeterminantsList from "./DeterminantsList/DeterminantsList";
import { AttendanceDeterminant } from "../../../types/attendance-departure";
import { useAttendanceDeterminants } from "../context/AttendanceDeterminantsContext";

interface AttendanceDeterminantsContentProps {
  determinants: AttendanceDeterminant[];
  onDeterminantClick: (id: string) => void;
}

/**
 * Content component for the attendance determinants tab
 * Puede recibir props directamente o usar el contexto
 */
const AttendanceDeterminantsContent: React.FC<
  AttendanceDeterminantsContentProps
> = ({ determinants, onDeterminantClick }) => {
  return (
    <div className="p-4 flex flex-col items-center gap-4">
      {/* Determinants List */}
      <DeterminantsList
        determinants={determinants}
        onClick={onDeterminantClick}
      />
    </div>
  );
};

export default AttendanceDeterminantsContent;
