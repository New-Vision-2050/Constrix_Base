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

export interface TaskActionFormValues {
  name: string;
  modelId: string;
  formConditions: Record<string, boolean | number>;
  appearBefore: string;
  appearAfter: string;
}
