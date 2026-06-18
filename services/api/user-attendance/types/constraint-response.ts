export interface AttendanceRecord {
  status: string;
  date: string;
  start_time: string;
  end_time: string;
  clock_in_time: string | null;
  clock_out_time: string | null;
  total_hours_present: number;
}

export interface EarlyClockInRules {
  prevent_early_clock_in: boolean;
  early_period: number;
  early_unit: "minute" | "hour" | string;
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
  early_clock_in_rules?: EarlyClockInRules;
  attendance: AttendanceRecord[];
}

export interface LocationWork {
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
}

export interface UserConstraintWorkRules {
  day_status: string;
  day_name: string;
  is_holiday: boolean;
  reason: string;
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
