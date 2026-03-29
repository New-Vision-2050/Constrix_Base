export interface CreateStageArgs {
  name: string;
  type: string;
  execute_type: string;
  icon: string;
  percentage: number;
}

export interface UpdateStageArgs {
  name?: string;
  type?: string;
  execute_type?: string;
  icon?: string;
  percentage?: number;
}

export interface CreateStepArgs {
  employee_id: string;
  is_accept: boolean;
  is_approve: boolean;
  duration: number;
  forms: string; // "approve" | "accept" | "financial" | "approve"
}
