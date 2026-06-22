export interface ProceduresSettingsOuterTab {
  id: number;
  name: string;
  type: string;
}

export interface ProceduresSettingsConfig {
  translationNamespace: string;
  outerTabs: ProceduresSettingsOuterTab[];
}

export interface ProceduresSettingsViewProps {
  outerTabs?: ProceduresSettingsOuterTab[];
  translationNamespace?: string;
}

export interface TaskActionConditionFormValue {
  key: string;
  isActive: boolean;
  sortOrder: number;
  settings: Record<string, string | number | boolean>;
}

export interface TaskActionFormValues {
  name: string;
  modelId: string;
  conditions: TaskActionConditionFormValue[];
  appearBeforeIds: string[];
  appearAfterIds: string[];
  isActive: boolean;
}
