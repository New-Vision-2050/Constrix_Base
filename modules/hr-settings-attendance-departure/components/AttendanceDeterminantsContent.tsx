import React from "react";
import DeterminantsList from "./DeterminantsList/DeterminantsList";
import { AttendanceDeterminant } from "../types/attendance-departure";

/**
 * Sample data for attendance determinants
 */
const sampleDeterminants: AttendanceDeterminant[] = [
  {
    id: "1",
    name: "محدد فرع",
    location: "جدة",
    status: true,
  },
  {
    id: "2",
    name: "محدد فرع",
    location: "الرياض",
    status: false,
  },
  {
    id: "3",
    name: "محدد فرع",
    location: "القصيم",
    status: true,
  }
];

/**
 * Content component for the attendance determinants tab
 */
const AttendanceDeterminantsContent: React.FC = () => {
  return (
    <div className="p-4 flex justify-center">
      <DeterminantsList determinants={sampleDeterminants} />
    </div>
  );
};

export default AttendanceDeterminantsContent;
