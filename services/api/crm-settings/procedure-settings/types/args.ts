export interface CreateStageArgs {
  name: string;
  type: string;
  execute_type: string;
  parent_id: string; //"parent-uuid-here",
  icon: string;
  percentage: number;
  deadline_days: number;
  deadline_hours: number;
  escalation_management_hierarchy_id: string;
  work_flow_id?: string;
}

export interface UpdateStageArgs {
  name?: string;
  type?: string;
  execute_type?: string;
  icon?: string;
  percentage?: number;
  deadline_days?: number;
  deadline_hours?: number;
  escalation_management_hierarchy_id?: string;
  work_flow_id?: string;
}

export interface ActionTakerManagementHierarchyItem {
  action_taker_management_hierarchy_type: string;
  is_Deputy_Director: boolean;
}

export interface CreateStepArgs {
  name: string;
  action_taker_type?: string;
  /** @deprecated use action_taker_management_hierarchies */
  action_taker_management_hierarchy_type?: string;
  /** @deprecated use action_taker_management_hierarchies */
  action_taker_alternative_management_hierarchy_type?: string[];
  action_taker_management_hierarchies?: ActionTakerManagementHierarchyItem[];
  /** Parallel array with action_taker_specific_procedure_id */
  action_taker_specific_procedure_type?: string[];
  /** Parallel array with action_taker_specific_procedure_type */
  action_taker_specific_procedure_id?: string[];
  branch_id?: number;
  management_id?: number;
  action_taker_user_ids: string[];
  concerned_management_hierarchy_ids: string[];
  is_accept: boolean;
  is_approve: boolean;
  is_view_only: boolean;
  is_return_with_notes: boolean;
  requires_approval_within_period: boolean;
  forms: string; // "approve" | "accept"
  approval_within_days?: number;
  approval_within_hours?: number;
  skipping_period?: number;
  escalation_management_hierarchy_id?: string;
  notify_by_email: boolean;
  notify_by_whatsapp: boolean;
  notify_by_sms: boolean;
  notify_by_push?: boolean;
  notify_by_voice?: boolean;
  duration?: number;
  report_type_ids?: string[];
}
