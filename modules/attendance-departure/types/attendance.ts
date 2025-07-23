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

export type ConstraintConfig = {
  time_rules: {
    weekly_schedule: weeklyScheduleDays;
  };
};

type AppliedConstraint = {
  id: string;
  constraint_name: string;
  constraint_config: ConstraintConfig;
};

// Attendance status record interface for attendance tables and dialogs
export interface AttendanceStatusRecord {
  applied_constraints: AppliedConstraint[];
  approved_at: string;
  approved_by: string;
  approved_by_user: string;
  break_duration_formatted: string;
  breaks: [];
  professional_data: {
    branch: string;
    job_code: string;
    management: string;
    attendance_constraint: AppliedConstraint;
  };
  clock_in_location: { latitude: number; longitude: number };
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
