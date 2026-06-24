"use client";

import type { ColumnDef } from "@/components/headless/table";
import AttendanceStatusBadge from "@/modules/attendance-departure/components/AttendanceDepartureTable/AttendanceStatusBadge";
import type { ConstraintSelectedEmployeePayload } from "@/services/api/attendance-constraints/types/response";
import { constraintEmployeeToAttendanceRecord } from "../utils/constraintEmployeeToAttendanceRecord";

export function getConstraintEmployeeAttendanceColumns(
  t: (key: string) => string,
): ColumnDef<ConstraintSelectedEmployeePayload>[] {
  return [
    {
      key: "day_status",
      name: t("columnEmployeeStatus"),
      sortable: false,
      render: (row) => {
        const record = constraintEmployeeToAttendanceRecord(row);
        const dayStatus = (
          record as { day_status?: { status?: string } | string }
        )?.day_status;
        const employeeStatus =
          row.attendance?.employee_status?.trim() ||
          row.employee_status?.trim();
        if (employeeStatus) return employeeStatus;
        if (typeof dayStatus === "object" && dayStatus?.status) {
          return dayStatus.status;
        }
        if (typeof dayStatus === "string" && dayStatus.trim()) {
          return dayStatus;
        }
        return "—";
      },
    },
    {
      key: "attendance_status",
      name: t("columnAttendanceStatus"),
      sortable: false,
      render: (row) => {
        const record = constraintEmployeeToAttendanceRecord(row);
        return (
          <AttendanceStatusBadge status={record.status} record={record} />
        );
      },
    },
  ];
}
