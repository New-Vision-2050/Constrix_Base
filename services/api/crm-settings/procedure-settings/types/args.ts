export interface CreateStageArgs {
  name: string;
  type: string;
  execute_type: string;
  icon: string;
  percentage: number;
  deadline_days: number;
  deadline_hours: number;
  escalation_user_id: string;
}

export interface UpdateStageArgs {
  name?: string;
  type?: string;
  execute_type?: string;
  icon?: string;
  percentage?: number;
  deadline_days?: number;
  deadline_hours?: number;
  escalation_user_id?: string;
}

export interface CreateStepArgs {
  name: string;
  branch_id?: number;
  management_id?: number;
  action_taker_user_ids: string[];
  concerned_user_ids: string[];
  is_accept: boolean;
  is_approve: boolean;
  is_view_only: boolean;
  is_return_with_notes: boolean;
  requires_approval_within_period: boolean;
  forms: string; // "approve" | "accept"
  approval_within_days?: number;
  approval_within_hours?: number;
  escalation_user_id?: string;
  notify_by_email: boolean;
  notify_by_whatsapp: boolean;
}
