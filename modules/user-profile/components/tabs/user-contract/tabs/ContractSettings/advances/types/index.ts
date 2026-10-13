/**
 * Types for the user advance-policies feature (assignment + requests).
 *
 * Backend contract (ADVANCE management spec):
 * - GET /users/{userId}/advance-policies -> rows of UserAdvancePolicy
 * - PUT /users/{userId}/advance-policies -> same rows after sync
 * - GET /advance-requests?user_id=...    -> paginated advance requests
 * - GET /advance-requests/{id}           -> single advance request
 *
 * Note: booleans are rendered by the API as 0/1.
 */

export interface UserAdvancePolicy {
  advance_policy_id: string;
  name: string;
  is_default: number | boolean;
  assigned_at: string | null;
  max_amount: number;
  max_installments: number;
  max_active_advances: number;
  requires_attachment: number | boolean;
  /** pending + approved requests under the policy */
  active_count: number;
  pending_amount: number;
  active_amount: number;
  /** max_active_advances - active_count (floor 0) */
  remaining_slots: number;
  /** 1 when the user may submit a new request under this policy right now */
  can_request: number | boolean;
}

export interface AdvanceTotals {
  activeCount: number;
  pendingAmount: number;
  activeAmount: number;
  remainingSlots: number;
}

export type AdvanceRequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled";

export interface AdvanceRequest {
  id: string;
  user_id?: string;
  user_name?: string;
  advance_policy_id?: string;
  advance_policy_name?: string;
  amount?: number;
  installments?: number;
  reason?: string | null;
  status: AdvanceRequestStatus | string;
  status_label_ar?: string;
  attachments?: string[];
  notes?: string | null;
  rejection_reason?: string | null;
  approved_at?: string | null;
  rejected_at?: string | null;
  workflow?: {
    in_progress?: boolean;
    pending_step_order?: number;
  } | null;
  created_at?: string;
}

export interface PaginatedAdvanceRequests {
  rows: AdvanceRequest[];
  lastPage: number;
}
