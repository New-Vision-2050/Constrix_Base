import type { InternalProcedureConditionArg } from "./args";

/** Item from GET /admin/forms_conditions */
export interface FormsConditionApiItem {
  key: string;
  type: string;
  label_ar: string;
  label_en?: string;
}

export interface GetFormsConditionsResponse {
  code: string;
  message: string | null;
  payload: FormsConditionApiItem[];
}

/** Normalized option for UI selects / checkboxes */
export interface FormConditionOption {
  id: string;
  key: string;
  type: string;
  name: string;
  label_ar: string;
  label_en?: string;
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

export type InternalProcedureSettingFormOption = FormConditionOption;

export interface InternalProcedure {
  id: string;
  name: string;
  type: string;
  form: string;
  parent_id?: string | null;
  conditions?: InternalProcedureConditionArg[];
  appears_before_id?: string | null;
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
