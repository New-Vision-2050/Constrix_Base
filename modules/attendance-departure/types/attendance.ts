export interface AttendanceHistoryRoot {
  code: string;
  message: string;
  pagination: Pagination;
  payload: AttendanceHistoryPayload[];
}

// Payload is an array of objects with dynamic keys representing time periods
export interface AttendanceHistoryPayload {
  [timeRange: string]: AttendanceHistoryRecord[] | number;
  total_hours: number;
}

export interface Pagination {
  page: number;
  next_page: number;
  last_page: number;
  result_count: number;
}

export interface AttendanceHistoryRecord {
  id: string;
  user_id: string;
  company_id: string;
  timeRange?: string; // Time range key from API payload (e.g., "2025-07-27 09:00 - 2025-07-27 02:00")
  clock_in_time: string;
  clock_out_time?: string;
  timezone: string;
  total_work_hours: number;
  total_break_hours: number;
  overtime_hours: number;
  is_late: number;
  is_absent: number;
  is_holiday: number;
  is_early_departure: number;
  late_minutes: number;
  early_departure_minutes: number;
  status: string;
  approved_by: any;
  approved_at: any;
  clock_in_location: ClockInLocation;
  clock_out_location?: ClockOutLocation;
  notes?: string;
  ip_address: any;
  created_at: string;
  updated_at: string;
  user: User;
  company: Company;
  approved_by_user: any;
  breaks: any[];
  work_date: string;
  is_on_break: boolean;
  is_clocked_in: number;
  duration_formatted: string;
  break_duration_formatted: string;
  overtime_formatted: string;
  day_status: DayStatus;
  professional_data: ProfessionalData;
}

export interface ClockInLocation {
  latitude: number;
  longitude: number;
}

export interface ClockOutLocation {
  latitude: number;
  longitude: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  birthdate: string;
  country: string;
  gender: string;
  phone: any;
}

export interface Company {
  id: string;
  name: string;
}

export interface DayStatus {
  status: string;
  reason: string;
}

export interface ProfessionalData {
  id: string;
  job_title: string;
  job_code: string;
  department: any;
  branch: string;
  management: string;
  attendance_constraint: AttendanceConstraint;
}

export interface AttendanceConstraint {
  id: string;
  constraint_name: string;
  constraint_type: string;
  constraint_config: ConstraintConfig;
}

export interface ConstraintConfig {
  default_location: boolean;
  time_rules: TimeRules;
  lateness_rules: LatenessRules;
  type_attendance: TypeAttendance;
  radius_enforcement: RadiusEnforcement;
  early_clock_in_rules: EarlyClockInRules;
}

export type TimeRules = {
  subtype: "multiple_periods" | string;
  weekly_schedule: WeeklySchedule;
  holidays: Holiday[];
  overtime_rules: RuleWithApproval;
  out_zone_rules: RuleWithApproval;
};

export type WeeklySchedule = {
  sunday: DaySchedule;
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
};

export interface Friday {
  enabled: boolean;
  periods: any[];
  total_work_hours: number;
}

export interface Monday {
  enabled: boolean;
  periods: any[];
  total_work_hours: number;
}

export interface Sunday {
  enabled: boolean;
  periods: Period[];
  total_work_hours: number;
}

export interface Period {
  end_time: string;
  start_time: string;
  total_work_hours: number;
}

export interface Tuesday {
  enabled: boolean;
  periods: any[];
  total_work_hours: number;
}

export interface Saturday {
  enabled: boolean;
  periods: any[];
  total_work_hours: number;
}

export interface Thursday {
  enabled: boolean;
  periods: any[];
  total_work_hours: number;
}

export interface Wednesday {
  enabled: boolean;
  periods: any[];
  total_work_hours: number;
}

export interface LatenessRules {
  unit: string;
  prevent_lateness: boolean;
  grace_period_minutes: string;
}

export type TypeAttendance = {
  location: boolean;
  fingerprint: boolean;
};

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

// Legacy types for backward compatibility
type PeriodType = {
  end_time: string;
  start_time: string;
};

type weeklyScheduleDay = {
  enabled: boolean;
  total_work_hours: number;
  periods: PeriodType[];
};

export type weeklyScheduleDays = {
  friday: weeklyScheduleDay;
  monday: weeklyScheduleDay;
  saturday: weeklyScheduleDay;
  sunday: weeklyScheduleDay;
  thursday: weeklyScheduleDay;
  tuesday: weeklyScheduleDay;
  wednesday: weeklyScheduleDay;
};

type AppliedConstraint = {
  id: string;
  constraint_name: string;
  constraint_type: string;
  constraint_config: ConstraintConfig;
};

// Attendance status record interface for attendance tables and dialogs
export interface AttendanceStatusRecord {
  attendance_constraint_id: string;
  applied_constraints: AppliedConstraint[];
  approved_at: string;
  approved_by: string;
  approved_by_user: string;
  break_duration_formatted: string;
  breaks: [];
  attendance_constraint: AttendanceConstraint;
  professional_data: ProfessionalData;
  latest_location: { latitude: number; longitude: number };
  clock_in_time: string;
  clock_out_location: { latitude: number; longitude: number };
  clock_out_time: string;
  company: { id: string; name: string };
  duration_formatted: string;
  early_departure_minutes: number;
  ip_address: string;
  is_clocked_in: number;
  is_early_departure: number;
  is_late: number;
  is_absent: number;
  is_holiday: number;
  is_on_break: boolean;
  late_minutes: number;
  notes: string;
  overtime_formatted: string;
  overtime_hours: number;
  status: string;
  timezone: string;
  total_break_hours: number;
  total_work_hours: number;
  updated_at: string;
  user: {
    id: string;
    name: string;
    birthdate: string;
    country: string;
    gender: string;
    email: string;
    phone: string;
  };
  work_date: string;
}

// Props for the TimeBox component
export interface TimeBoxProps {
  label: string;
  time: string | undefined;
  defaultTime?: string;
}

// Props for the DialogContainer component
export interface DialogContainerProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}

// Props for the EmployeeInfoSection component
export interface EmployeeInfoSectionProps {
  record: AttendanceStatusRecord;
}

// Props for the AttendanceStatusBadge component
export interface AttendanceStatusBadgeProps {
  status: string;
  record: AttendanceStatusRecord;
}

// Props for the ApproverBadge component
export interface ApproverBadgeProps {
  approver: string;
  record: AttendanceStatusRecord;
}

// Interface for work period data input format
export interface InputPeriodType {
  start_time: string;
  end_time: string;
}

// Additional types for enhanced attendance determinants

export type DaySchedule = {
  enabled: boolean;
  total_work_hours?: number;
  periods: Period[];
  early_clock_in_rules?: ClockRule;
  lateness_rules?: ClockRule;
};

export type ClockRule = {
  prevent_early_clock_in?: boolean;
  prevent_lateness?: boolean;
  grace_period_minutes: number;
  unit: "hour" | "minute" | "day";
};

export type RuleWithApproval = {
  requires_approval: boolean;
  approval_threshold_minutes: number;
  unit: "hour" | "minute" | "day";
};

export type Holiday = {
  name: string;
  date: string; // e.g., "2025-09-23"
};
