import type { ProjectEmployee } from "@/services/api/all-projects/types/response";
import type { Employee } from "@/modules/projects/project/components/project-tabs/tabs/staff/types";

function resolveAttendanceRecordId(
  attendance: NonNullable<ProjectEmployee["attendance"]>,
): string | null {
  const raw = attendance.id ?? attendance.attendance_id;
  if (raw == null || typeof raw !== "string") return null;

  const trimmed = raw.trim();
  return trimmed || null;
}

function resolveAttendanceConstraintId(
  attendance: NonNullable<ProjectEmployee["attendance"]>,
): string | null {
  if (
    typeof attendance.attendance_constraint_id === "string" &&
    attendance.attendance_constraint_id.trim()
  ) {
    return attendance.attendance_constraint_id.trim();
  }

  const constraintId = attendance.attendance_constraint?.id?.trim();
  return constraintId || null;
}

export function mapProjectEmployeeDto(item: ProjectEmployee): Employee {
  const u = item.user;
  const company = item.company;
  const pr = item.project_role;
  const attendance = item.attendance;

  return {
    id: item.id,
    projectId: item.project_id,
    projectRole: pr
      ? {
          id: pr.id,
          name: pr.name,
          slug: pr.slug,
          is_default: pr.is_default,
        }
      : null,
    user: {
      id: u.id,
      name: u.name?.trim() ? u.name : "—",
      email: u.email?.trim() ?? "",
      phone: (u.phone ?? u.mobile ?? "").trim(),
    },
    company: company
      ? {
          id: String(company.id),
          name: company.name?.trim() ? company.name : "—",
        }
      : { id: "", name: "—" },
    assignedAt: item.assigned_at?.trim() ?? "",
    assignedBy: item.assigned_by ?? null,
    createdAt: item.created_at?.trim() ?? "",
    attendance: attendance
      ? {
          attendance_id: resolveAttendanceRecordId(attendance),
          employee_status: attendance.employee_status?.trim() || null,
          status: attendance.status?.trim() || null,
          is_absent: attendance.is_absent,
          is_late: attendance.is_late,
          is_holiday: attendance.is_holiday,
          day_status: attendance.day_status ?? null,
          work_date: attendance.work_date?.trim() || null,
          clock_in_time: attendance.clock_in_time?.trim() || null,
          attendance_constraint_id: resolveAttendanceConstraintId(attendance),
          attendance_constraint: attendance.attendance_constraint ?? null,
        }
      : null,
  };
}
