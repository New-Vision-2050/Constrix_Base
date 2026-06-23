import type { AttendanceStatusRecord } from "@/modules/attendance-departure/types/attendance";
import type { Employee } from "../types";

function todayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

function resolveDayStatus(
  dayStatus: Employee["attendance"] extends { day_status?: infer D } ? D : never,
) {
  if (!dayStatus) return undefined;
  if (typeof dayStatus === "string") {
    return dayStatus.trim() ? { status: dayStatus.trim(), reason: "" } : undefined;
  }
  if (typeof dayStatus === "object" && dayStatus.status?.trim()) {
    return {
      status: dayStatus.status.trim(),
      reason: dayStatus.reason?.trim() ?? "",
    };
  }
  return undefined;
}

/** Id sent to `/attendance/{id}/applied-attendance` — uses `attendance.id`. */
function resolveAttendanceRecordId(attendance: Employee["attendance"]): string {
  if (!attendance?.attendance_id?.trim()) return "";
  return attendance.attendance_id.trim();
}

function resolveAttendanceConstraintId(attendance: Employee["attendance"]): string {
  if (!attendance) return "";

  return (
    attendance.attendance_constraint_id?.trim() ||
    attendance.attendance_constraint?.id?.trim() ||
    ""
  );
}

/** Maps a project employee row to the attendance table record shape used by badges/dialogs. */
export function employeeToAttendanceRecord(employee: Employee): AttendanceStatusRecord {
  const attendance = employee.attendance;
  const workDate = attendance?.work_date?.trim() || todayDateString();
  const attendanceRecordId = resolveAttendanceRecordId(attendance);
  const attendanceConstraintId = resolveAttendanceConstraintId(attendance);

  const attendanceConstraint = attendance?.attendance_constraint
    ? {
        id: attendance.attendance_constraint.id,
        constraint_name: attendance.attendance_constraint.constraint_name,
        constraint_type: "",
        constraint_config: {} as AttendanceStatusRecord["attendance_constraint"]["constraint_config"],
      }
    : ({ constraint_name: "" } as AttendanceStatusRecord["attendance_constraint"]);

  return {
    id: attendanceRecordId,
    attendance_constraint_id: attendanceConstraintId,
    applied_constraints: [],
    approved_at: "",
    approved_by: "",
    approved_by_user: "",
    break_duration_formatted: "",
    breaks: [],
    attendance_constraint: attendanceConstraint as AttendanceStatusRecord["attendance_constraint"],
    professional_data: {
      id: "",
      job_title: "",
      job_code: "",
      department: null,
      branch: employee.company.name,
      management: "",
      attendance_constraint: attendanceConstraint as AttendanceStatusRecord["professional_data"]["attendance_constraint"],
    },
    latest_location: { latitude: 0, longitude: 0 },
    clock_in_time: attendance?.clock_in_time ?? "",
    clock_out_location: { latitude: 0, longitude: 0 },
    clock_out_time: "",
    company: employee.company,
    duration_formatted: "",
    early_departure_minutes: 0,
    ip_address: "",
    is_clocked_in: 0,
    is_early_departure: 0,
    is_late: attendance?.is_late ?? 0,
    is_absent: attendance?.is_absent ?? 0,
    is_holiday: attendance?.is_holiday ?? 0,
    is_on_break: false,
    late_minutes: 0,
    notes: "",
    overtime_formatted: "",
    overtime_hours: 0,
    status: attendance?.status ?? "",
    timezone: "",
    total_break_hours: 0,
    total_work_hours: 0,
    updated_at: "",
    user: {
      id: employee.user.id,
      name: employee.user.name,
      birthdate: "",
      country: "",
      gender: "",
      email: employee.user.email,
      phone: employee.user.phone,
    },
    work_date: workDate,
    day_status: resolveDayStatus(attendance?.day_status),
  } as AttendanceStatusRecord & {
    day_status?: { status: string; reason: string } | string;
  };
}
