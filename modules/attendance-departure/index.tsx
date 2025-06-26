"use client";

import AttendanceDateSelector from "./components/AttendanceDateSelector";
import AttendanceDepartureTable from "./components/AttendanceDepartureTable/AttendanceDepartureTable";
import AttendanceDepartureSearchFilter from "./components/AttendanceDepartureSearchFilter";
import AttendanceMap from "./components/map/AttendanceMap";
import MapSearchFilter from "./components/map/MapSearchFilter";
import EmployeeDetailsSheet from "./components/map/EmployeeDetails";
import AttendanceStatusDialog from "./components/AttendanceDepartureTable/AttendanceStatusDialog";
import { AttendanceProvider, useAttendance } from "./context/AttendanceContext";
import AttendanceDepartureStatisticsCards from "./components/StatisticsCards/AttendanceDepartureStatisticsCards";

// Internal component that uses the context
function AttendanceContent() {
  const { view, isEmployeeDialogOpen, selectedEmployee, closeEmployeeDialog } = useAttendance();

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Date selector */}
      <AttendanceDateSelector />

      {/* Statistics cards */}
      <AttendanceDepartureStatisticsCards />

      {/* Search filter */}
      <AttendanceDepartureSearchFilter />

      {/* Table or map */}
      {view === "table" ? (
        <AttendanceDepartureTable />
      ) : (
        <>
          <MapSearchFilter />
          <AttendanceMap />
        </>
      )}
      
      {/* Employee details sheet dialog */}
      <EmployeeDetailsSheet 
        isOpen={isEmployeeDialogOpen}
        onClose={closeEmployeeDialog}
        employee={selectedEmployee}
      />

      {/* Attendance status dialog */}
      <AttendanceStatusDialog />
    </div>
  );
}

// Main component that provides the context
export default function AttendanceDepartureIndex() {
  return (
    <AttendanceProvider>
      <div className="flex flex-col gap-4 container px-6">
        <AttendanceContent />
      </div>
    </AttendanceProvider>
  );
}
