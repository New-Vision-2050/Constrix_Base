export interface ProceduresSettingsOuterTab {
  id: number;
  name: string;
  type: string;
}

export type ProceduresAddProcedureVariant = "default" | "document-classification";

export interface ProceduresSettingsConfig {
  translationNamespace: string;
  outerTabs: ProceduresSettingsOuterTab[];
  /** When true, hides خطة العمل / branch tabs and always shows stages. */
  hideWorkPlanTabs?: boolean;
  /** Controls which "Add procedure" dialog is shown. */
  addProcedureVariant?: ProceduresAddProcedureVariant;
}

export interface ProceduresSettingsViewProps {
  outerTabs?: ProceduresSettingsOuterTab[];
  translationNamespace?: string;
  hideWorkPlanTabs?: boolean;
  addProcedureVariant?: ProceduresAddProcedureVariant;
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
}
