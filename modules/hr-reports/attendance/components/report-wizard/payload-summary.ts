import type {
  EmployeeScopeMode,
  ReportDisplayModeId,
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
  employeesData: (
    key: string,
    values?: Record<string, string | number | boolean | Date>,
  ) => string;
  branches: (key: string) => string;
  attendanceData: (key: string) => string;
  reviewScreen: (key: string) => string;
};

export type WizardPayloadSummaryLabels = {
  periodLabel: string;
  reportTypesLabel: string;
  employeeStatusLabel: string;
  branchLabel: string;
  exportLabel: string;
  languageLabel: string;
  /** Payroll / scheduling steps are omitted from this flow. */
  emailLabel: string;
  sortingLabel: string;
  displayModeLabel: string;
};

export function formatWizardPeriod(
  step1: ReportWizardStep1,
  tWizard: WizardPayloadSummaryTranslators["wizard"],
  tMonth: WizardPayloadSummaryTranslators["month"],
): string {
  const { periodType, year, month } = step1;
  switch (periodType) {
    case "range":
      return `${step1.dateFrom} – ${step1.dateTo}`;
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

function employeeScopeSummaryLabel(
  scope: EmployeeScopeMode,
  selectedCount: number,
  tEmp: WizardPayloadSummaryTranslators["employeesData"],
): string {
  if (scope === "all") return tEmp("statusAll");
  return tEmp("scopeSelectEmployeesSummary", { count: selectedCount });
}

function displayModeSummaryLabel(
  mode: ReportDisplayModeId,
  tAtt: WizardPayloadSummaryTranslators["attendanceData"],
): string {
  return mode === "by_day"
    ? tAtt("displayModeByDay")
    : tAtt("displayModeEmployeePerPage");
}

export function buildWizardPayloadSummary(
  payload: ReportWizardPayload,
  tr: WizardPayloadSummaryTranslators,
): WizardPayloadSummaryLabels {
  const { step1, step2, step3 } = payload;

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

  const emailLabel = tr.reviewScreen("notApplicable");
  const sortingLabel = tr.reviewScreen("notApplicable");
  const displayModeLabel = displayModeSummaryLabel(
    step3.displayMode,
    tr.attendanceData,
  );

  const branchLabel =
    step2.branchId.trim() === "" || step2.branchId === STEP2_FILTER_UNSET
      ? tr.reviewScreen("noneSelected")
      : (step2.branchName?.trim() || step2.branchId);

  return {
    periodLabel: formatWizardPeriod(step1, tr.wizard, tr.month),
    reportTypesLabel,
    employeeStatusLabel: employeeScopeSummaryLabel(
      step2.employeeScope,
      step2.employeeUserIds.length,
      tr.employeesData,
    ),
    branchLabel,
    exportLabel,
    languageLabel,
    emailLabel,
    sortingLabel,
    displayModeLabel,
  };
}
