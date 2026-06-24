"use client";

import { AttendanceProvider } from "@/modules/attendance-departure/context/AttendanceContext";
import AttendanceStatusDialog from "@/modules/attendance-departure/components/AttendanceDepartureTable/AttendanceStatusDialog";
import ApproverDialog from "@/modules/attendance-departure/components/AttendanceDepartureTable/ApproverDialog";

type ConstraintEmployeesAttendanceShellProps = {
  children: React.ReactNode;
};

export function ConstraintEmployeesAttendanceShell({
  children,
}: ConstraintEmployeesAttendanceShellProps) {
  return (
    <AttendanceProvider>
      {children}
      <AttendanceStatusDialog />
      <ApproverDialog />
    </AttendanceProvider>
  );
}
