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
  employee_id: string;
  is_accept: boolean;
  is_approve: boolean;
  duration: number;
  forms: string; // "approve" | "accept" | "financial" | "approve"
  /** Step display name (optional; sent when API supports it). */
  name?: string;
  /** Selected management hierarchy id (when not HR). */
  management_id?: string;
  /** Display name of selected management (optional; when API expects it). */
  management_name?: string;
}
