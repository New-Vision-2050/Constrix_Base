export interface ProjectEmployeeRoleSummary {
  id: string;
  name: string;
  slug: string;
  is_default: boolean;
}

export interface ProjectEmployeeAttendanceSummary {
  id: string;
  constraint_name: string;
}

export interface ProjectEmployeeAttendance {
  /** Attendance record id from API `attendance.id`; used for `/attendance/{id}/applied-attendance` */
  attendance_id?: string | null;
  employee_status?: string | null;
  status?: string | null;
  is_absent?: number;
  is_late?: number;
  is_holiday?: number;
  day_status?: string | { status?: string; reason?: string } | null;
  work_date?: string | null;
  clock_in_time?: string | null;
  attendance_constraint_id?: string | null;
  attendance_constraint?: ProjectEmployeeAttendanceSummary | null;
}

export interface Employee {
  id: string;
  projectId: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  company: { id: string; name: string };
  assignedAt: string;
  assignedBy: { id: string; name: string } | null;
  createdAt: string;
  /** Embedded role from employees list API (`project_role`) */
  projectRole?: ProjectEmployeeRoleSummary | null;
  /** Attendance snapshot from `GET .../employees/project/{id}` */
  attendance?: ProjectEmployeeAttendance | null;
}
