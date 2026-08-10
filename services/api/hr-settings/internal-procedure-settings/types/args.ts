export interface ConditionSettingSchemaItem {
  key: string;
  type: string;
  label_ar: string;
  label_en?: string;
  default?: string | number | boolean;
}

export interface MapPolygonPoint {
  lat: number;
  lng: number;
}

export type MapPolygon = MapPolygonPoint[];

export interface RichInternalProcedureCondition {
  key: string;
  is_active: boolean;
  sort_order: number;
  settings: Record<string, string | number | boolean | MapPolygon[]>;
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
  /** Omit when creating a root procedure — null/empty fails UUID validation. */
  parent_id?: string | null;
  /** Required for project-scoped procedure types (e.g. document sequence). */
  project_id?: string;
  conditions: RichInternalProcedureCondition[];
  appears_before_ids: string[];
  appears_after_ids: string[];
  sort_order: number;
  is_active: boolean;
  attachment_type_id?: string | null;
  attachment_sub_type_id?: string | null;
  attachment_sub_sub_type_id?: string | null;
  job_attribute_id?: string | null;
  used_in_document_cycle?: boolean;
  appears_in_attachments_library?: boolean;
  appears_in_archive_after_approval?: boolean;
  requires_asset_id?: boolean;
  /** Accepted shared companies that can see this project procedure. Omit or empty = all. */
  receiver_company_ids?: string[];
  /** Create-only: copy steps from an existing project procedure. */
  source_procedure_setting_id?: string;
}

export type UpdateInternalProcedureArgs = CreateInternalProcedureArgs;
