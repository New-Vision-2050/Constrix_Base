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
  TaskActionFormValues,
} from "./types";
