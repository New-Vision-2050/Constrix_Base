export interface ConstraintDetailsResponse {
  code: string;
  message: string;
  payload: ConstraintDetails;
}

export interface ConstraintDetails {
  id: string;
  constraint_name: string;
  constraint_type: string;
  branch_locations: BranchLocation[];
  notes: string;
  is_active: number;
  priority: number;
  start_date: any;
  end_date: any;
  config: ConstraintConfig;
  branches: any[];
  created_by: string;
  created_at: string;
}

export interface BranchLocation {
  name: string;
  radius: number;
  address: string;
  latitude: string;
  branch_id: string;
  longitude: string;
}

export interface ConstraintConfig {
  time_rules: TimeRules;
  lateness_rules: LatenessRules;
  type_attendance: TypeAttendance;
  radius_enforcement: RadiusEnforcement;
  early_clock_in_rules: EarlyClockInRules;
}

export interface TimeRules {
  subtype: string;
  weekly_schedule: WeeklySchedule;
}

export interface WeeklySchedule {
  friday: DaySchedule;
  monday: DaySchedule;
  sunday: DaySchedule;
  tuesday: DaySchedule;
  saturday: DaySchedule;
  thursday: DaySchedule;
  wednesday: DaySchedule;
}

export interface DaySchedule {
  enabled: boolean;
  periods: Period[];
  total_work_hours: number;
}

export interface Period {
  end_time: string;
  start_time: string;
}

export interface LatenessRules {
  unit: string;
  prevent_lateness: boolean;
  grace_period_minutes: string;
}

export interface TypeAttendance {
  location: boolean;
  fingerprint: boolean;
}

export interface RadiusEnforcement {
  unit: string;
  end_shift_if_violated: boolean;
  out_of_radius_time_threshold: string;
}

export interface EarlyClockInRules {
  unit: string;
  grace_period_minutes: string;
  prevent_early_clock_in: boolean;
}
