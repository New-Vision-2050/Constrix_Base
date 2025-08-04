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
import withPermissions from "@/lib/permissions/client/withPermissions";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import Can from "@/lib/permissions/client/Can";

// Internal component that uses the context
function AttendanceContent() {
  const { view, isEmployeeDialogOpen, selectedEmployee, closeEmployeeDialog } =
    useAttendance();

  return (
    <div className="flex flex-col gap-2 w-full">
      <Can check={[PERMISSIONS.EMPLOYEE_ATTENDANCE.view]}>
        {/* Date selector */}
        {/* {view === "map" && <AttendanceDateSelector />} */}

        {/* Statistics cards */}
        <AttendanceDepartureStatisticsCards />

        {/* Table or map */}
        {view === "table" ? (
          <AttendanceDepartureTable />
        ) : (
          <>
            {/* Search filter */}
            <AttendanceDepartureSearchFilter />

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

        {/* Approver dialog */}
        <ApproverDialog />
      </Can>
    </div>
  );
}

// Main component that provides the context
function AttendanceDepartureIndex() {
  return (
    <AttendanceProvider>
      <div className="flex flex-col gap-4 container px-6">
        <AttendanceContent />
      </div>
    </AttendanceProvider>
  );
}

export default withPermissions(AttendanceDepartureIndex, [
  PERMISSIONS.EMPLOYEE_ATTENDANCE.view,
]);
