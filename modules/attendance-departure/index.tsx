"use client";

import AttendanceDateSelector from "./components/AttendanceDateSelector";
import AttendanceDepartureTable from "./components/AttendanceDepartureTable/AttendanceDepartureTable";
import AttendanceDepartureSearchFilter from "./components/AttendanceDepartureSearchFilter";
import AttendanceMap from "./components/map/AttendanceMap";
import MapSearchFilter from "./components/map/MapSearchFilter";
import EmployeeDetailsSheet from "./components/map/EmployeeDetails";
import AttendanceStatusDialog from "./components/AttendanceDepartureTable/AttendanceStatusDialog";
import ApproverDialog from "./components/AttendanceDepartureTable/ApproverDialog";
import { AttendanceProvider, useAttendance } from "./context/AttendanceContext";
import AttendanceDepartureStatisticsCards from "./components/StatisticsCards/AttendanceDepartureStatisticsCards";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

// Internal component that uses the context
function AttendanceContent() {
  const { view, isEmployeeDialogOpen, selectedEmployee, closeEmployeeDialog } =
    useAttendance();

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Date selector */}
      {/* {view === "map" && <AttendanceDateSelector />} */}

      {/* Statistics cards */}
      <AttendanceDepartureStatisticsCards />

      {/* Table or map */}
      {view === "table" ? (
        <AttendanceDepartureTable />
      ) : (
        <Can check={[PERMISSIONS.attendance.attendance_departure.map]}>
          {/* Search filter */}
          <AttendanceDepartureSearchFilter />

          <MapSearchFilter />
          <AttendanceMap />
        </Can>
      )}

      {/* Employee details sheet dialog */}
      <EmployeeDetailsSheet
        isOpen={isEmployeeDialogOpen}
        onClose={closeEmployeeDialog}
        employee={selectedEmployee}
      />

      {/* Attendance status dialog */}
      <AttendanceStatusDialog />

      {/* Approver dialog */}
      <ApproverDialog />
    </div>
  );
}

// Main component that provides the context
export default function AttendanceDepartureIndex() {
  return (
    <AttendanceProvider>
      <div className="flex flex-col gap-4 container px-6">
        <Can check={[PERMISSIONS.attendance.attendance_departure.view]}>
          <AttendanceContent />
        </Can>
      </div>
    </AttendanceProvider>
  );
}
