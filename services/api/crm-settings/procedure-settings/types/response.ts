export interface Stage {
  id: string;
  name: string;
  type: string;
  execute_type: string;
  icon: string;
  percentage: number;
}

export interface GetStagesResponse {
  code: string;
  message: string | null;
  payload: Stage[];
}

export interface Employee {
  id: string;
  name: string;
  email: string;
}

export interface ProcedureStep {
  id: number;
  procedure_setting_id: string;
  employee_id: string;
  is_accept: boolean;
  is_approve: boolean;
  duration: number;
  forms: {
    approve: boolean;
    accept: boolean;
    financial: boolean;
  };
  employee: Employee;
  /** Step label when provided by API */
  name?: string | null;
  /** Selected management hierarchy id when persisted by API */
  management_id?: string | number | null;
  management_name?: string | null;
}

export interface GetStepsResponse {
  code: string;
  message: string | null;
  payload: ProcedureStep[];
}
