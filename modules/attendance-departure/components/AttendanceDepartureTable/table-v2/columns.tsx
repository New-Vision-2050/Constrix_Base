import React from "react";
import { AttendanceStatusRecord } from "@/modules/attendance-departure/types/attendance";
import AttendanceStatusBadge from "../AttendanceStatusBadge";
import ApproverBadge from "../ApproverBadge";
import { ColumnDef } from "@/components/headless/table";

/**
 * Helper function to safely access nested properties
 */
const getNestedValue = (obj: any, path: string): any => {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
};

/**
 * Column configuration for the attendance table
 */
export const getAttendanceColumns = (
  t: (key: string) => string
): ColumnDef<AttendanceStatusRecord>[] => [
  {
    key: "user.name",
    name: t("columns.name"),
    sortable: true,
    render: (row) => row?.user?.name || "-",
  },
  {
    key: "work_date",
    name: t("columns.date"),
    sortable: true,
    render: (row) => row?.work_date || "-",
  },
  {
    key: "professional_data.job_code",
    name: t("columns.jobCode"),
    sortable: true,
    render: (row) => row?.professional_data?.job_code || "-",
  },
  {
    key: "professional_data.branch",
    name: t("columns.branch"),
    sortable: true,
    render: (row) => row?.professional_data?.branch || "-",
  },
  {
    key: "professional_data.management",
    name: t("columns.management"),
    sortable: true,
    render: (row) => row?.professional_data?.management || "-",
  },
  {
    key: "professional_data.attendance_constraint",
    name: t("columns.approver"),
    sortable: true,
    render: (row) => <ApproverBadge approver={row?.status} record={row} />,
  },
  {
    key: "day_status",
    name: t("columns.employeeStatus"),
    sortable: true,
    render: (row) => {
      const dayStatus = (row as any)?.day_status;
      return dayStatus?.status || dayStatus || "-";
    },
  },
  {
    key: "status",
    name: t("columns.attendanceStatus"),
    sortable: true,
    render: (row) => <AttendanceStatusBadge status={row.status} record={row} />,
  },
];
