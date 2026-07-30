"use client";

import { cn } from "@/lib/utils";

export type AttendanceListCode =
  | "present"
  | "required_attendance"
  | "holiday"
  | "absent"
  | "on_task";

export type AttendanceListStatus = {
  id: string | null;
  code: AttendanceListCode;
  label: string;
  employee_status: string | null;
  status: string | null;
  is_absent: 0 | 1;
  is_late: 0 | 1;
  is_holiday: 0 | 1;
  day_status: string | null;
  attendance_constraint_id: string | null;
  attendance_constraint: {
    id: string;
    constraint_name: string;
  } | null;
  work_date: string | null;
  clock_in_time: string | null;
};

const attendanceClassByCode: Record<AttendanceListCode, string> = {
  present: "bg-green-500/15 text-green-600 border-green-500/30",
  required_attendance: "bg-amber-500/15 text-amber-600 border-amber-500/30",
  holiday: "bg-blue-500/15 text-blue-600 border-blue-500/30",
  absent: "bg-red-500/15 text-red-600 border-red-500/30",
  on_task: "bg-teal-500/15 text-teal-600 border-teal-500/30",
};

export function SubEntityAttendanceBadge({
  attendance,
}: {
  attendance?: AttendanceListStatus | null;
}) {
  if (!attendance?.code) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold whitespace-nowrap",
        attendanceClassByCode[attendance.code] ??
          "bg-gray-500/15 text-gray-500 border-gray-500/30",
      )}
    >
      {attendance.label}
    </span>
  );
}

export default SubEntityAttendanceBadge;
