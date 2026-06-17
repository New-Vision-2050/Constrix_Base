import { useTranslations } from "next-intl";
import { useProceduresSettings } from "../context/ProceduresSettingsContext";

export function useProceduresSettingsTranslations() {
  const { translationNamespace } = useProceduresSettings();

  return {
    t: useTranslations(translationNamespace),
    ts: useTranslations(`${translationNamespace}.subTabs`),
    tc: useTranslations(`${translationNamespace}.common`),
    tStages: useTranslations(`${translationNamespace}.stages`),
    tTaskAction: useTranslations(`${translationNamespace}.taskActionDialog`),
    tStepCard: useTranslations(`${translationNamespace}.stepCard`),
  };
}
