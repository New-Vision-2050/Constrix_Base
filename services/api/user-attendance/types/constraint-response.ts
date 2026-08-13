export interface AttendanceRecord {
  status: string;
  date: string;
  start_time: string;
  end_time: string;
  clock_in_time: string | null;
  clock_out_time: string | null;
  total_hours_present: number;
  total_work_hours?: string;
  overtime_hours?: string;
  pre_shift_hours?: string;
  in_shift_hours?: string;
  post_shift_hours?: string;
  outside_window_hours?: string;
}

export interface WorkPeriodConstraint {
  status: string;
  day: string;
  date: string;
  start_time: string;
  end_time: string;
  extends_to_next_day: boolean;
  total_work_hours: number;
  is_active: boolean;
  total_hours_present: number;
  can_clock_in: boolean;
  can_clock_out: boolean;
  can_clock_in_from?: string | null;
  can_clock_in_until?: string | null;
  can_clock_out_until?: string | null;
  expected_clock_out_time?: string | null;
  expected_clock_out_at?: string | null;
  absent_at?: string | null;
  required_work_minutes?: number;
  is_absent?: boolean;
  attendance: AttendanceRecord[];
}

export interface LocationWork {
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  source?: string;
  expires_at?: string | null;
  reference_id?: string | null;
}

export type AttendanceType = "regular" | "flexible";

export interface UserConstraintWorkRules {
  day_status: string;
  day_name: string;
  is_holiday: boolean;
  reason: string;
  attendance_type?: AttendanceType;
  flexible_required_work_minutes?: number;
  all_work_periods: WorkPeriodConstraint[];
  location_work: LocationWork;
  additional_locations: LocationWork[];
}

export interface UserConstraintTodayPayload {
  user_id: string;
  user_name: string;
  date: string;
  work_rules: UserConstraintWorkRules;
}

export interface UserConstraintTodayResponse {
  code?: string;
  message?: string;
  payload: UserConstraintTodayPayload;
}
