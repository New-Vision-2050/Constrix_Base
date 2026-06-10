import type { ConstraintBasicInfo } from "./response";

/** Request body for PATCH `/attendance/constraints/:constraintId/basic-info` */
export type PatchConstraintBasicInfoParams = Partial<ConstraintBasicInfo>;

/** Query params for GET `/attendance/constraints/:constraintId/employees` */
export interface GetConstraintEmployeesParams {
  page?: number;
  per_page?: number;
  /** Filter employees by name */
  name?: string;
}

/** Query params for GET `/attendance/constraints/:constraintId/locations` */
export interface GetConstraintLocationsParams {
  page?: number;
  per_page?: number;
}

/** Body for POST `/attendance/constraints/:constraintId/employees` (assign user) */
export interface AssignConstraintEmployeeParams {
  user_id: string;
}

/** Single location in POST `/attendance/constraints/:constraintId/locations` body */
export interface ConstraintLocationCreateItem {
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
}

/** Body for POST `/attendance/constraints/:constraintId/locations` (bulk create) */
export interface BulkCreateConstraintLocationsBody {
  locations: ConstraintLocationCreateItem[];
}

/** Day keys for weekly shift assignment (POST `/attendance/constraints/:id/shifts`). */
export type ConstraintShiftWeekday =
  | "saturday"
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday";

export interface ConstraintShiftPeriodItem {
  start_time: string;
  end_time: string;
  extends_to_next_day: boolean;
}

/** Body for POST `/attendance/constraints/:constraintId/shifts` — weekly mode */
export interface AssignConstraintShiftsWeeklyBody {
  mode: "weekly";
  days: ConstraintShiftWeekday[];
  periods: ConstraintShiftPeriodItem[];
}

/** One day block inside `schedule` for daily shift mode */
export interface ConstraintShiftDailyDayBlock {
  periods: ConstraintShiftPeriodItem[];
}

/** Body for POST `/attendance/constraints/:constraintId/shifts` — daily mode */
export interface AssignConstraintShiftsDailyBody {
  mode: "daily";
  schedule: Partial<
    Record<ConstraintShiftWeekday, ConstraintShiftDailyDayBlock>
  >;
}

export type AssignConstraintShiftsBody =
  | AssignConstraintShiftsWeeklyBody
  | AssignConstraintShiftsDailyBody;

/** Body for PATCH `/attendance/constraints/:constraintId/rules` */
export interface PatchConstraintRulesParams {
  lateness_minutes: number;
  early_clock_in_minutes: number;
  max_over_time: number;
  out_zone_minutes: number;
  max_working_hours: number;
}

/** Body for PATCH `/attendance/constraints/:constraintId/notifications` */
export interface PatchConstraintNotificationsParams {
  notify_late_arrival: boolean;
  notify_unexcused_absence: boolean;
  notify_early_departure: boolean;
}
