export interface ProceduresSettingsOuterTab {
  id: number;
  /** i18n key under `subTabs` when `label` is absent. */
  name: string;
  type: string;
  /** Resolved display label from API (preferred over i18n `name`). */
  label?: string;
  /** When set, this tab represents a concrete internal procedure. */
  procedureId?: string;
}

export type ProceduresAddProcedureVariant = "default" | "document-classification";

export interface ProceduresSettingsConfig {
  translationNamespace: string;
  outerTabs: ProceduresSettingsOuterTab[];
  /** When true, hides خطة العمل / branch tabs and always shows stages. */
  hideWorkPlanTabs?: boolean;
  /** Controls which "Add procedure" dialog is shown. */
  addProcedureVariant?: ProceduresAddProcedureVariant;
  /** When set, passed as `project_id` on internal-procedures requests. */
  projectId?: string;
}

export interface ProceduresSettingsViewProps {
  outerTabs?: ProceduresSettingsOuterTab[];
  translationNamespace?: string;
  hideWorkPlanTabs?: boolean;
  addProcedureVariant?: ProceduresAddProcedureVariant;
  projectId?: string;
}

export interface MapPolygonPoint {
  lat: number;
  lng: number;
}

export type MapPolygon = MapPolygonPoint[];

export interface TaskActionConditionFormValue {
  key: string;
  isActive: boolean;
  sortOrder: number;
  settings: Record<string, string | number | boolean | MapPolygon[]>;
}

export interface TaskActionFormValues {
  name: string;
  modelId: string;
  conditions: TaskActionConditionFormValue[];
  appearBeforeIds: string[];
  appearAfterIds: string[];
  isActive: boolean;
  /** Document classification (project_procedure add/edit form) */
  attachmentTypeId?: string;
  attachmentSubTypeId?: string;
  attachmentSubSubTypeId?: string;
  jobAttributeId?: string;
  usedInDocumentCycle?: boolean;
  showInAttachmentsLibrary?: boolean;
  showInArchiveAfterApproval?: boolean;
  requiresAssetId?: boolean;
  /** Accepted shared companies that can see this project procedure. */
  receiverCompanyIds?: string[];
  /** When true on update, include receiver_company_ids in the payload. */
  receiverCompanyIdsChanged?: boolean;
  /** Create-only: copy steps from an existing project procedure. */
  sourceProcedureSettingId?: string;
}
