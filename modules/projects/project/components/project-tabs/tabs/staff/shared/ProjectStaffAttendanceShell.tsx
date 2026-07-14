"use client";

import { AttendanceProvider } from "@/modules/attendance-departure/context/AttendanceContext";
import AttendanceStatusDialog from "@/modules/attendance-departure/components/AttendanceDepartureTable/AttendanceStatusDialog";
import ApproverDialog from "@/modules/attendance-departure/components/AttendanceDepartureTable/ApproverDialog";

type ProjectStaffAttendanceShellProps = {
  children: React.ReactNode;
};

export function ProjectStaffAttendanceShell({
  children,
}: ProjectStaffAttendanceShellProps) {
  return (
    <AttendanceProvider eagerFetch={false}>
      {children}
      <AttendanceStatusDialog />
      <ApproverDialog />
    </AttendanceProvider>
  );
}
