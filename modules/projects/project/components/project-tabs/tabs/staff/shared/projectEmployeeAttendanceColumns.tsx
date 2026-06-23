"use client";

import React from "react";
import { ColumnDef } from "@/components/headless/table";
import ApproverBadge from "@/modules/attendance-departure/components/AttendanceDepartureTable/ApproverBadge";
import AttendanceStatusBadge from "@/modules/attendance-departure/components/AttendanceDepartureTable/AttendanceStatusBadge";
import type { Employee } from "../types";
import { employeeToAttendanceRecord } from "../utils/employeeToAttendanceRecord";

export function getProjectEmployeeAttendanceColumns(
  t: (key: string) => string,
): ColumnDef<Employee>[] {
  return [
    {
      key: "attendance.attendance_constraint",
      name: t("staff.columns.approver"),
      sortable: true,
      render: (row) => {
        const record = employeeToAttendanceRecord(row);
        return <ApproverBadge approver={record.status} record={record} />;
      },
    },
    {
      key: "day_status",
      name: t("staff.columns.employeeStatus"),
      sortable: true,
      render: (row) => {
        const record = employeeToAttendanceRecord(row);
        const dayStatus = (
          record as { day_status?: { status?: string } | string }
        )?.day_status;
        const employeeStatus = row.attendance?.employee_status?.trim();
        if (employeeStatus) return employeeStatus;
        if (typeof dayStatus === "object" && dayStatus?.status)
          return dayStatus.status;
        if (typeof dayStatus === "string" && dayStatus.trim()) return dayStatus;
        return "-";
      },
    },
    {
      key: "status",
      name: t("staff.columns.attendanceStatus"),
      sortable: true,
      render: (row) => {
        const record = employeeToAttendanceRecord(row);
        return <AttendanceStatusBadge status={record.status} record={record} />;
      },
    },
  ];
}
