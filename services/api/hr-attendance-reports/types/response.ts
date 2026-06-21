export type EmployeeAttendanceReportStatus = "approved" | "pending" | "rejected" | string;

export interface EmployeeAttendanceMonthlyReportApi {
  month: string;
  days_in_month: number;
  required_attendance_days: number;
  used_leaves: number;
  earned_leave_days: number;
  month_holidays: number;
  required_hours: number;
  actual_attendance_days: number;
  remaining_attendance_days: number;
  leave_balance_used: number;
  remaining_leave_balance: number;
  actual_worked_hours: number;
  remaining_hours: number;
  delays: number;
  overtime: number;
  status: EmployeeAttendanceReportStatus;
}

export interface EmployeeAttendanceReportsPagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface EmployeeAttendanceReportsPayload {
  employee: {
    id: string;
    name: string;
  };
  contract: {
    attendance_days: number;
    required_hours: number;
    leave_allowance: number;
  };
  achieved: {
    attendance_days: number;
    worked_hours: number;
    used_leaves: number;
    used_holidays: number;
  };
  remaining: {
    attendance_days: number;
    worked_hours: number;
    remaining_leaves: number;
  };
  monthly_reports: {
    data: EmployeeAttendanceMonthlyReportApi[];
    pagination?: EmployeeAttendanceReportsPagination;
  };
}

export interface EmployeeAttendanceReportsResponse {
  code?: string;
  message?: string | null;
  payload: EmployeeAttendanceReportsPayload;
}
