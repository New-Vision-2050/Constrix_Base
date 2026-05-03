import type {
  EmployeeStatusFilter,
  ReportWizardPayload,
  ReportWizardStep1,
} from "./types";
import { STEP2_FILTER_UNSET } from "./constants-step2";

const MONTH_KEYS = [
  "m1",
  "m2",
  "m3",
  "m4",
  "m5",
  "m6",
  "m7",
  "m8",
  "m9",
  "m10",
  "m11",
  "m12",
] as const;

/** Scoped translators from `useTranslations` — same namespaces as `WizardStepReview`. */
export type WizardPayloadSummaryTranslators = {
  wizard: (
    key: string,
    values?: Record<string, string | number | boolean | Date>,
  ) => string;
  reportTypes: (key: string) => string;
  month: (key: string) => string;
  employeesData: (key: string) => string;
  branches: (key: string) => string;
  filtersOptions: (key: string) => string;
  reviewScreen: (key: string) => string;
};

export type WizardPayloadSummaryLabels = {
  periodLabel: string;
  reportTypesLabel: string;
  employeeStatusLabel: string;
  branchLabel: string;
  exportLabel: string;
  languageLabel: string;
  emailLabel: string;
  sortingLabel: string;
};

export function formatWizardPeriod(
  step1: ReportWizardStep1,
  tWizard: WizardPayloadSummaryTranslators["wizard"],
  tMonth: WizardPayloadSummaryTranslators["month"],
): string {
  const { periodType, year, month } = step1;
  switch (periodType) {
    case "monthly":
      return `${tMonth(MONTH_KEYS[month - 1])} ${year}`;
    case "yearly":
      return String(year);
    case "weekly":
      return `${year} · ${tWizard("periodWeekly")}`;
    case "quarterly": {
      const q = step1.quarter ?? Math.ceil(month / 3);
      return tWizard("quarterYearShort", { quarter: q, year });
    }
    default:
      return `${year}`;
  }
}

function employeeStatusLabel(
  status: EmployeeStatusFilter,
  tEmp: WizardPayloadSummaryTranslators["employeesData"],
): string {
  switch (status) {
    case "all":
      return tEmp("statusAll");
    case "active":
      return tEmp("statusActive");
    case "inactive":
      return tEmp("statusInactive");
    case "on_leave":
      return tEmp("statusOnLeave");
    case "dismissed":
      return tEmp("statusDismissed");
    default:
      return status;
  }
}

export function buildWizardPayloadSummary(
  payload: ReportWizardPayload,
  tr: WizardPayloadSummaryTranslators,
): WizardPayloadSummaryLabels {
  const { step1, step2, step5 } = payload;

  const reportTypesLabel =
    step1.reportTypeIds.length === 0
      ? tr.reviewScreen("noneSelected")
      : step1.reportTypeIds.map((id) => tr.reportTypes(id)).join(" + ");

  const exportLabel =
    step1.exportFormat === "pdf"
      ? tr.wizard("fmtPdf")
      : step1.exportFormat === "excel"
        ? tr.wizard("fmtExcel")
        : tr.wizard("fmtCsv");

  const languageLabel =
    step1.reportLanguage === "ar"
      ? tr.wizard("langAr")
      : tr.wizard("langEn");

  const emailLabel = step5.autoEmail
    ? tr.reviewScreen("enabled")
    : tr.reviewScreen("disabled");

  const sortingLabel = `${tr.filtersOptions(
    `mainSortValues.${step5.mainSortBy}`,
  )} (${tr.filtersOptions(`sortDirections.${step5.sortDirection}`)})`;

  const branchLabel =
    step2.location.trim() === "" || step2.location === STEP2_FILTER_UNSET
      ? tr.reviewScreen("noneSelected")
      : tr.branches(step2.location);

  return {
    periodLabel: formatWizardPeriod(step1, tr.wizard, tr.month),
    reportTypesLabel,
    employeeStatusLabel: employeeStatusLabel(step2.employeeStatus, tr.employeesData),
    branchLabel,
    exportLabel,
    languageLabel,
    emailLabel,
    sortingLabel,
  };
}
