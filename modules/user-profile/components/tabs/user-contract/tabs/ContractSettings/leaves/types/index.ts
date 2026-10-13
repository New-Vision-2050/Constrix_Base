/**
 * Types for the user leave-policies feature (leave workflow + assignment).
 *
 * Backend contract (docs/LEAVE_WORKFLOW_API_SPEC):
 * - GET /users/{userId}/leave-policies?year=  -> rows of UserLeavePolicyBalance
 * - PUT /users/{userId}/leave-policies        -> same rows after sync
 * - GET /leave-requests?user_id=...           -> paginated leave requests
 *
 * Note: booleans are rendered by the API as 0/1.
 */

export interface UserLeavePolicyBalance {
  leave_policy_id: string;
  name: string;
  /** 1 = the company default policy assigned automatically to every user */
  is_default: number | boolean;
  assigned_at: string | null;
  leave_type_id: string;
  leave_type_name: string;
  requires_attachment: number | boolean;
  is_deduct_from_balance: number | boolean;
  /** work_day = only scheduled work days count; calendar = every day counts */
  day_calculation_type: string;
  /** upfront = full total_days; monthly = accrued so far this year */
  entitlement_type: string;
  min_notice_days: number;
  allow_exceed_balance: number | boolean;
  year: number;
  /** Yearly entitlement for `year` */
  entitled_days: number;
  /** Approved request days in `year` */
  used_days: number;
  /** Pending request days in `year` (reserved, not yet used) */
  pending_days: number;
  /** entitled - used - pending (floor 0) */
  available_days: number;
}

/** Aggregated balances across all assigned policies for one year. */
export interface LeaveBalanceTotals {
  entitled: number;
  used: number;
  pending: number;
  available: number;
}

export type LeaveRequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled";

export interface UserLeaveRequest {
  id: string;
  leave_type_id?: string;
  leave_type_name?: string;
  leave_policy_id?: string;
  leave_policy_name?: string;
  start_date?: string;
  end_date?: string;
  days_count?: number;
  status: LeaveRequestStatus | string;
  status_label_ar?: string;
  rejection_reason?: string | null;
  created_at?: string;
  workflow?: {
    in_progress?: boolean;
    pending_step_order?: number;
  } | null;
  pending_step_order?: number;
}

export interface PaginatedLeaveRequests {
  rows: UserLeaveRequest[];
  lastPage: number;
  total?: number;
}
