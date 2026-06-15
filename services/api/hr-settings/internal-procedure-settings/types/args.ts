export interface InternalProcedureConditionArg {
  key: string;
  value: boolean | number;
}

export interface CreateInternalProcedureArgs {
  name: string;
  type: string;
  form: string;
  parent_id: string | null;
  conditions: InternalProcedureConditionArg[];
  appears_before_id: string | null;
  appears_after_id: string | null;
  sort_order: number;
  is_active: boolean;
}

export type UpdateInternalProcedureArgs = CreateInternalProcedureArgs;
