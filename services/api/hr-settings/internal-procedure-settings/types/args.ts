export interface ConditionSettingSchemaItem {
  key: string;
  type: string;
  label_ar: string;
  label_en?: string;
  default?: string | number | boolean;
}

export interface RichInternalProcedureCondition {
  key: string;
  is_active: boolean;
  sort_order: number;
  settings: Record<string, string | number | boolean>;
}

/** @deprecated Legacy flat condition entry */
export interface LegacyInternalProcedureConditionArg {
  key: string;
  value: boolean | number;
}

export interface CreateInternalProcedureArgs {
  name: string;
  type: string;
  form: string;
  parent_id: string | null;
  conditions: RichInternalProcedureCondition[];
  appears_before_ids: string[];
  appears_after_ids: string[];
  sort_order: number;
  is_active: boolean;
}

export type UpdateInternalProcedureArgs = CreateInternalProcedureArgs;
