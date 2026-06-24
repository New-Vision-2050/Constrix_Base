export type ConstraintCatalogRow = {
  id: string;
  constraint_name: string;
  /** When API omits this, both accordions use the full catalog (same as job form selects). */
  is_additional?: boolean;
};

/** Result shape shared by catalog list + employee constraint-locations grouping. */
export type GroupedConstraintsLocations = {
  main: ConstraintCatalogRow[];
  additional: ConstraintCatalogRow[];
};

/** Payload from GET/PATCH basic-info responses (flexible backend shape). */
export type ConstraintBasicInfo = Partial<{
  name: string;
  constraint_name: string;
  constraint_type: string;
  branches: { id: string; name: string }[];
  branch_locations: { id: string; name: string }[];
  branch_ids: (string | number)[];
  config: Record<string, unknown>;
  timezone: string;
  reference_time: string;
  daily_start_time: string;
  daily_reference_time: string;
  country_code: string;
  country: string;
}>;

export type ConstraintEmployeeAttendanceSummary = {
  id?: string;
  constraint_name?: string;
};

/** Attendance snapshot on a constraint employee list row (flexible API shape). */
export type ConstraintEmployeeAttendance = {
  id?: string | null;
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
  attendance_constraint?: ConstraintEmployeeAttendanceSummary | null;
};

/** One row inside constraint employees API list payloads (normalized in UI parsers). */
export type ConstraintSelectedEmployeePayload = {
  id?: string;
  user_id?: string;
  name?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  user?: {
    name?: string;
    email?: string;
    phone?: string;
    mobile?: string;
  };
  projects?: { id: string; name: string }[];
  project?: string | { name?: string };
  branch?: string | { name?: string };
  status?: string;
  state?: string;
  is_active?: number | boolean;
  attendance?: ConstraintEmployeeAttendance | null;
  employee_status?: string | null;
  day_status?: string | { status?: string; reason?: string } | null;
  is_absent?: number;
  is_late?: number;
  is_holiday?: number;
};

export type ConstraintEmployeesListApiResponse = {
  payload?:
    | ConstraintSelectedEmployeePayload[]
    | Record<string, ConstraintSelectedEmployeePayload>
    | unknown;
  pagination?: { last_page?: number; result_count?: number };
  last_page?: number;
  result_count?: number;
};

export type ConstraintEmployeesListNormalized = {
  employees: ConstraintSelectedEmployeePayload[];
  totalPages: number;
  totalItems: number;
};

export type ConstraintLocationPayload = Record<string, unknown>;

export type ConstraintLocationsListApiResponse = {
  payload?: unknown;
  pagination?: { last_page?: number; result_count?: number };
  last_page?: number;
  result_count?: number;
  [key: string]: unknown;
};

/** Rules payload for GET/PATCH `/attendance/constraints/:constraintId/rules` */
export type ConstraintRules = {
  lateness_minutes: number;
  early_clock_in_minutes: number;
  max_over_time: number;
  out_zone_minutes: number;
  max_working_hours: number;
};

export type ConstraintRulesApiResponse = {
  payload?: ConstraintRules | Record<string, unknown>;
  [key: string]: unknown;
};

/** Notification toggles for GET/PATCH `/attendance/constraints/:constraintId/notifications` */
export type ConstraintNotifications = {
  notify_late_arrival: boolean;
  notify_unexcused_absence: boolean;
  notify_early_departure: boolean;
};

export type ConstraintNotificationsApiResponse = {
  payload?: ConstraintNotifications | Record<string, unknown>;
  [key: string]: unknown;
};
