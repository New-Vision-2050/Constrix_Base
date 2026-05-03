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
  escalation_user_id?: string;
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
  action_taker_user_ids?: string[];
  concerned_user_ids?: string[];
  /** API may send boolean or 0/1 */
  is_accept: boolean | number;
  is_approve: boolean | number;
  is_view_only?: boolean | number;
  is_return_with_notes?: boolean | number;
  requires_approval_within_period?: boolean | number;
  forms: ProcedureStepForms;
  approval_within_days?: number;
  approval_within_hours?: number;
  escalation_user_id?: string | null;
  notify_by_email?: boolean;
  notify_by_whatsapp?: boolean;
  /** Legacy fields */
  employee_id?: string;
  employee?: Employee;
  duration?: number;
  management_name?: string | null;
}

export interface GetStepsResponse {
  code: string;
  message: string | null;
  payload: ProcedureStep[];
}
