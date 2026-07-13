import type {
  ProceduresSettingsConfig,
  ProceduresSettingsOuterTab,
} from "../types";

export const DEFAULT_HR_PROCEDURES_OUTER_TABS: ProceduresSettingsOuterTab[] = [
  {
    id: 0,
    name: "workTasks",
    type: "employee_task",
  },
];

export const DEFAULT_HR_PROCEDURES_CONFIG: ProceduresSettingsConfig = {
  translationNamespace: "hr-settings.proceduresSettings",
  outerTabs: DEFAULT_HR_PROCEDURES_OUTER_TABS,
  hideWorkPlanTabs: false,
  addProcedureVariant: "default",
};
