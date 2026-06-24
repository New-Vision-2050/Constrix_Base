import type {
  LegacyInternalProcedureConditionArg,
  RichInternalProcedureCondition,
} from "./args";

export interface ConditionSettingSchemaSelectOptionApiItem {
  value: string;
  label_ar: string;
  label_en?: string;
}

export interface ConditionSettingSchemaVisibleWhenApiItem {
  key: string;
  value: string | number | boolean;
}

export interface ConditionSettingSchemaApiItem {
  key: string;
  type: string;
  label_ar: string;
  label_en?: string;
  default?: string | number | boolean;
  options?: ConditionSettingSchemaSelectOptionApiItem[];
  visible_when?: ConditionSettingSchemaVisibleWhenApiItem;
}

/** Item from GET /procedure-settings/forms-conditions */
export interface FormsConditionApiItem {
  key: string;
  type: string;
  category: string;
  category_label_ar: string;
  category_label_en?: string;
  label_ar: string;
  label_en?: string;
  form_group?: string;
  form_group_label_ar?: string;
  form_group_label_en?: string;
  settings_schema: ConditionSettingSchemaApiItem[];
}

export interface GetFormsConditionsResponse {
  code?: string;
  message?: string | null;
  payload?: FormsConditionApiItem[];
  data?: FormsConditionApiItem[];
}

export interface ConditionSettingSchemaSelectOption {
  value: string;
  label: string;
  label_ar: string;
  label_en?: string;
}

export interface ConditionSettingSchemaVisibleWhen {
  key: string;
  value: string | number | boolean;
}

export interface ConditionSettingSchemaOption {
  key: string;
  type: string;
  label: string;
  label_ar: string;
  label_en?: string;
  default?: string | number | boolean;
  options?: ConditionSettingSchemaSelectOption[];
  visibleWhen?: ConditionSettingSchemaVisibleWhen;
}

/** Normalized condition definition for UI */
export interface FormConditionOption {
  id: string;
  key: string;
  type: string;
  category: string;
  categoryLabel: string;
  name: string;
  label_ar: string;
  label_en?: string;
  formGroup?: string;
  formGroupLabel?: string;
  formGroupLabelAr?: string;
  formGroupLabelEn?: string;
  settingsSchema: ConditionSettingSchemaOption[];
}

export interface InternalProcedureSettingFormApiItem {
  key?: string;
  id?: string | number;
  type?: string;
  label_ar?: string;
  label_en?: string;
  name?: string;
}

export interface GetInternalProcedureSettingFormsResponse {
  code: string;
  message: string | null;
  payload: InternalProcedureSettingFormApiItem[];
}

export interface InternalProcedureSettingFormOption {
  id: string;
  key: string;
  type: string;
  name: string;
  label_ar: string;
  label_en?: string;
}

export type InternalProcedureConditions =
  | RichInternalProcedureCondition[]
  | LegacyInternalProcedureConditionArg[]
  | Record<string, boolean | number>;

export interface InternalProcedure {
  id: string;
  name: string;
  type: string;
  form: string;
  parent_id?: string | null;
  conditions?: InternalProcedureConditions;
  appears_before_ids?: string[];
  appears_after_ids?: string[];
  /** @deprecated Use appears_before_ids */
  appears_before_id?: string | null;
  /** @deprecated Use appears_after_ids */
  appears_after_id?: string | null;
  sort_order?: number;
  is_active?: boolean;
}

export interface CreateInternalProcedureResponse {
  code: string;
  message: string | null;
  payload: InternalProcedure;
}

export type UpdateInternalProcedureResponse = CreateInternalProcedureResponse;

export interface GetInternalProceduresResponse {
  code: string;
  message: string | null;
  payload: InternalProcedure[];
}

export interface GetInternalProcedureResponse {
  code: string;
  message: string | null;
  payload: InternalProcedure;
}
