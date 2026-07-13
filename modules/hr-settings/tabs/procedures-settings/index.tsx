import ProceduresSettingsView from "./ProceduresSettingsView";

export default function ProceduresSettings() {
  return <ProceduresSettingsView />;
}

export { ProceduresSettingsView };
export { ProceduresSettingsProvider, useProceduresSettings } from "./context/ProceduresSettingsContext";
export { useProceduresSettingsTranslations } from "./hooks/useProceduresSettingsTranslations";
export {
  DEFAULT_HR_PROCEDURES_CONFIG,
  DEFAULT_HR_PROCEDURES_OUTER_TABS,
} from "./constants/defaultConfig";
export type {
  ProceduresSettingsConfig,
  ProceduresSettingsOuterTab,
  ProceduresSettingsViewProps,
  ProceduresAddProcedureVariant,
  TaskActionFormValues,
  TaskActionConditionFormValue,
} from "./types";
export { default as FormConditionsSection } from "./components/FormConditionsSection";
export { default as FormConditionsTable } from "./components/FormConditionsTable";
export {
  buildInitialConditionsFromDefinitions,
  groupDefinitionsByFormGroup,
  mapConditionsToApiPayload,
  mergeConditionsWithDefinitions,
} from "./utils/conditionFormUtils";
export type { ConditionFormGroup } from "./utils/conditionFormUtils";
