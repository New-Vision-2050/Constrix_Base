export type UserAttendanceStatusKey =
  | "present"
  | "absent"
  | "late"
  | "leave"
  | "off"
  | "required"
  | "on_task";

export interface UserAttendanceCalendarDay {
  date: string;
  day_name: string;
  day_number: number;
  status_key: UserAttendanceStatusKey;
  status: string;
  work_hours: number | null;
  duration_formatted: string | null;
  dot_color: string;
  attendance_count: number;
}

export interface UserAttendanceCalendarSummary {
  total_days: number;
  present_count: number;
  late_count: number;
  absent_count: number;
  leave_count: number;
  off_count: number;
  required_count: number;
  on_task_count?: number;
  total_work_hours: number;
}

export interface UserAttendanceCalendarData {
  days: UserAttendanceCalendarDay[];
  summary: UserAttendanceCalendarSummary;
}

export interface UserAttendanceCalendarResponse {
  code?: string;
  message?: string;
  payload: UserAttendanceCalendarData;
}
