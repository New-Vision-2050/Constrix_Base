export interface EscalationUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface WorkFlow {
  id: string;
  name: string;
  company_id?: string;
}

export interface Branch {
  id: number;
  name: string;
  type: string;
  company_id?: string;
}

export interface Stage {
  id: string;
  name: string;
  type: string;
  execute_type: string;
  icon: string;
  percentage: number;
  deadline_days?: number;
  deadline_hours?: number;
  escalation_management_hierarchy_id?: string;
  escalation_user?: EscalationUser;
  work_flow_id?: string;
  work_flow?: WorkFlow;
}

/** Response for /procedure-settings?type=xxx&branch_id=xxx */
export interface WorkFlowPayload {
  id: string;
  name: string;
  type: string;
  branches: Branch[];
  "procedure-settings": Stage[];
}

export interface GetStagesResponse {
  code: string;
  message: string | null;
  payload: WorkFlowPayload;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
}

/** Backend may return enum string or legacy boolean map */
export type ProcedureStepForms =
  | "approve"
  | "accept"
  | "financial"
  | {
      approve: boolean;
      accept: boolean;
      financial: boolean;
    };

export interface ProcedureStep {
  id: number;
  procedure_setting_id: string;
  name?: string | null;
  branch_id?: number | null;
  management_id?: number | null;
  action_taker_type?: string | null;
  action_taker_management_hierarchy_type?: string | null;
  /** May be a legacy scalar string or the new array form */
  action_taker_alternative_management_hierarchy_type?: string | string[] | null;
  action_taker_management_hierarchies?:
    | {
        action_taker_management_hierarchy_type?: string | null;
        is_Deputy_Director?: boolean | number | null;
      }[]
    | null;
  /** May be a legacy scalar string or the new array form */
  action_taker_specific_procedure_type?: string | string[] | null;
  /** May be a legacy scalar or the new array form */
  action_taker_specific_procedure_id?: string | number | string[] | null;
  /** Convenience field from API (read-only, use for display) */
  action_taker_specific_procedures?: { type: string; id: string }[] | null;
  action_taker_user_ids?: string[];
  concerned_management_hierarchy_ids?: string[];
  receiver_company_ids?: string[] | null;
  /** API may send boolean or 0/1 */
  is_accept: boolean | number;
  is_approve: boolean | number;
  is_view_only?: boolean | number;
  is_return_with_notes?: boolean | number;
  requires_approval_within_period?: boolean | number;
  forms: ProcedureStepForms;
  approval_within_days?: number;
  approval_within_hours?: number;
  skipping_period?: number;
  escalation_management_hierarchy_id?: string | null;
  notify_by_email?: boolean;
  notify_by_whatsapp?: boolean;
  notify_by_sms?: boolean;
  notify_by_push?: boolean;
  notify_by_voice?: boolean;
  /** Legacy fields */
  employee_id?: string;
  employee?: Employee;
  duration?: number;
  report_type_ids?: string[];
  management_name?: string | null;
  /** Often present on GET step payloads when flat id arrays are absent */
  action_takers?: { user?: { id?: string | number; name?: string } }[];
  concerned_users?: { user?: { id?: string | number; name?: string } }[];
}

export interface GetStepsResponse {
  code: string;
  message: string | null;
  payload: ProcedureStep[];
}

/** Item from GET /procedure-settings/types */
export interface ProcedureSettingTypeDto {
  id?: number | string;
  type?: string;
  key?: string;
  slug?: string;
  name?: string;
  name_ar?: string;
  name_en?: string;
  label?: string;
  label_ar?: string;
  label_en?: string;
  group?: string;
  category?: string;
  module?: string;
}

export interface GetProcedureSettingTypesResponse {
  code?: string;
  message?: string | null;
  payload?: ProcedureSettingTypeDto[];
  data?: ProcedureSettingTypeDto[];
}
