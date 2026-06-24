import type { AttendanceStatusRecord } from "@/modules/attendance-departure/types/attendance";
import type {
  ConstraintEmployeeAttendance,
  ConstraintSelectedEmployeePayload,
} from "@/services/api/attendance-constraints/types/response";

function todayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

function resolveAttendanceSnapshot(
  row: ConstraintSelectedEmployeePayload,
): ConstraintEmployeeAttendance | null {
  if (row.attendance) return row.attendance;

  const hasFlatAttendance =
    row.employee_status != null ||
    row.day_status != null ||
    row.is_absent != null ||
    row.is_late != null ||
    row.is_holiday != null;

  if (!hasFlatAttendance) return null;

  return {
    employee_status: row.employee_status ?? null,
    status: null,
    is_absent: row.is_absent,
    is_late: row.is_late,
    is_holiday: row.is_holiday,
    day_status: row.day_status ?? null,
  };
}

function resolveDayStatus(
  dayStatus: ConstraintEmployeeAttendance["day_status"],
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

function resolveAttendanceRecordId(
  attendance: ConstraintEmployeeAttendance,
): string {
  const raw = attendance.id ?? attendance.attendance_id;
  if (raw == null || typeof raw !== "string") return "";
  return raw.trim();
}

function resolveAttendanceConstraintId(
  attendance: ConstraintEmployeeAttendance,
): string {
  return (
    attendance.attendance_constraint_id?.trim() ||
    attendance.attendance_constraint?.id?.trim() ||
    ""
  );
}

/** Maps a constraint employee row to the attendance table record shape used by badges/dialogs. */
export function constraintEmployeeToAttendanceRecord(
  row: ConstraintSelectedEmployeePayload,
): AttendanceStatusRecord {
  const attendance = resolveAttendanceSnapshot(row);
  const workDate = attendance?.work_date?.trim() || todayDateString();
  const attendanceRecordId = attendance ? resolveAttendanceRecordId(attendance) : "";
  const attendanceConstraintId = attendance
    ? resolveAttendanceConstraintId(attendance)
    : "";

  const attendanceConstraint = attendance?.attendance_constraint
    ? {
        id: attendance.attendance_constraint.id ?? "",
        constraint_name: attendance.attendance_constraint.constraint_name ?? "",
        constraint_type: "",
        constraint_config: {} as AttendanceStatusRecord["attendance_constraint"]["constraint_config"],
      }
    : ({ constraint_name: "" } as AttendanceStatusRecord["attendance_constraint"]);

  const branchLabel =
    typeof row.branch === "string"
      ? row.branch
      : row.branch?.name?.trim() ||
        row.projects?.[0]?.name?.trim() ||
        (typeof row.project === "string"
          ? row.project
          : row.project?.name?.trim()) ||
        "";

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
      branch: branchLabel,
      management: "",
      attendance_constraint: attendanceConstraint as AttendanceStatusRecord["professional_data"]["attendance_constraint"],
    },
    latest_location: { latitude: 0, longitude: 0 },
    clock_in_time: attendance?.clock_in_time ?? "",
    clock_out_location: { latitude: 0, longitude: 0 },
    clock_out_time: "",
    company: { id: "", name: branchLabel },
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
      id: String(row.user_id ?? row.id ?? ""),
      name: row.name ?? row.full_name ?? row.user?.name ?? "",
      birthdate: "",
      country: "",
      gender: "",
      email: row.email ?? row.user?.email ?? "",
      phone: row.phone ?? row.mobile ?? row.user?.phone ?? row.user?.mobile ?? "",
    },
    work_date: workDate,
    day_status: resolveDayStatus(attendance?.day_status),
  } as AttendanceStatusRecord & {
    day_status?: { status: string; reason: string } | string;
  };
}
