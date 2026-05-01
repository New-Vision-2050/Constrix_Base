import { hrReportsMessages } from "@/messages/groups/hr-reports";
import type { CreateReportApiBody } from "@/services/api/hr-reports/attendance";
import type { Locale, MessageItem, MessagesGroup } from "@/messages/types";
import type { ReportWizardPayload, ReportWizardStep1 } from "../components/report-wizard/types";
import { STEP2_FILTER_UNSET } from "../components/report-wizard/constants-step2";
import { normalizeStep3EnumFields } from "./step3-enums";

function asGroup(
  v: MessagesGroup | MessageItem | undefined,
): MessagesGroup | undefined {
  if (
    v &&
    typeof v === "object" &&
    "get" in v &&
    typeof (v as MessagesGroup).get === "function"
  ) {
    return v as MessagesGroup;
  }
  return undefined;
}

function asItem(
  v: MessagesGroup | MessageItem | undefined,
): MessageItem | undefined {
  if (
    v &&
    typeof v === "object" &&
    "en" in v &&
    "ar" in v &&
    !("get" in v)
  ) {
    return v as MessageItem;
  }
  return undefined;
}

function attendanceWizardGroup(): MessagesGroup | undefined {
  return asGroup(hrReportsMessages.get("attendanceReport"));
}

function wizardMessages(): MessagesGroup | undefined {
  const ar = attendanceWizardGroup();
  return ar ? asGroup(ar.get("wizard")) : undefined;
}

function reportTypeLabel(id: string, locale: Locale): string {
  const wiz = wizardMessages();
  const types = wiz ? asGroup(wiz.get("reportTypes")) : undefined;
  const item = types ? asItem(types.get(id)) : undefined;
  return item?.[locale] ?? id;
}

function monthLabel(month: number, locale: Locale): string {
  const wiz = wizardMessages();
  const months = wiz ? asGroup(wiz.get("month")) : undefined;
  const key = `m${month}` as `m${number}`;
  const item = months ? asItem(months.get(key)) : undefined;
  return item?.[locale] ?? String(month);
}

function periodWeeklyLabel(locale: Locale): string {
  const wiz = wizardMessages();
  const item = wiz ? asItem(wiz.get("periodWeekly")) : undefined;
  return item?.[locale] ?? "";
}

function defaultReportTitle(locale: Locale): string {
  const item = asItem(hrReportsMessages.get("attendanceReports"));
  return item?.[locale] ?? "Attendance report";
}

function quarterYearLabel(q: number, year: number, locale: Locale): string {
  const wiz = wizardMessages();
  const item = wiz ? asItem(wiz.get("quarterYearShort")) : undefined;
  const tpl = item?.[locale];
  if (!tpl) return `Q${q} ${year}`;
  return tpl
    .replace(/\{quarter\}/g, String(q))
    .replace(/\{year\}/g, String(year));
}

function formatPeriodPart(step1: ReportWizardStep1, locale: Locale): string {
  const { periodType, year, month } = step1;

  switch (periodType) {
    case "monthly":
      return `${monthLabel(month, locale)} ${year}`;
    case "yearly":
      return String(year);
    case "weekly": {
      const w = periodWeeklyLabel(locale);
      return w ? `${year} · ${w}` : String(year);
    }
    case "quarterly": {
      const q = step1.quarter ?? Math.ceil(month / 3);
      return quarterYearLabel(q, year, locale);
    }
    default:
      return `${year}`;
  }
}

/** Builds bilingual display names for `POST /reports` using the same copy as the wizard messages. */
export function buildBilingualReportName(
  payload: ReportWizardPayload,
): { ar: string; en: string } {
  const { step1 } = payload;
  const typesPart = (locale: Locale) =>
    step1.reportTypeIds.length === 0
      ? defaultReportTitle(locale)
      : step1.reportTypeIds.map((id) => reportTypeLabel(id, locale)).join(" + ");

  const enTypes = typesPart("en");
  const arTypes = typesPart("ar");
  const periodEn = formatPeriodPart(step1, "en");
  const periodAr = formatPeriodPart(step1, "ar");

  return {
    en: `${enTypes} - ${periodEn}`,
    ar: `${arTypes} - ${periodAr}`,
  };
}

function nullableFilterField(value: string): string | null {
  const t = value.trim();
  if (t === "" || t === STEP2_FILTER_UNSET) return null;
  return value;
}

export function mapStep1ForApi(step1: ReportWizardStep1) {
  const common = {
    reportTypeIds: [...step1.reportTypeIds],
    periodType: step1.periodType,
    year: step1.year,
    exportFormat: step1.exportFormat,
    reportLanguage: step1.reportLanguage,
    paperSize: step1.paperSize,
    printOrientation: step1.printOrientation,
  };

  switch (step1.periodType) {
    case "monthly":
      return { ...common, month: step1.month, week: null, quarter: null };
    case "weekly":
      return {
        ...common,
        month: null,
        week: step1.week ?? step1.month,
        quarter: null,
      };
    case "quarterly":
      return {
        ...common,
        month: null,
        week: null,
        quarter: step1.quarter ?? Math.ceil(step1.month / 3),
      };
    case "yearly":
      return {
        ...common,
        month: null,
        week: null,
        quarter: null,
      };
    default:
      return { ...common, month: step1.month, week: null, quarter: null };
  }
}

function sanitizeStep3ForApi(step3: ReportWizardPayload["step3"]) {
  const n = normalizeStep3EnumFields(step3);
  return {
    ...n,
    attendanceDataTypeIds: [...n.attendanceDataTypeIds],
  };
}

export function buildCreateReportApiBody(
  payload: ReportWizardPayload,
  name: { ar: string; en: string },
): CreateReportApiBody {
  const { step2, step3, step4, step5 } = payload;

  return {
    name: { ar: name.ar, en: name.en },
    template_id: null,
    config: {
      step1: mapStep1ForApi(payload.step1),
      step2: {
        employeeStatus: step2.employeeStatus,
        location: nullableFilterField(step2.location),
        management: nullableFilterField(step2.management),
        department: nullableFilterField(step2.department),
        jobTitle: nullableFilterField(step2.jobTitle),
        contractTypeIds: [...step2.contractTypeIds],
        nationality: nullableFilterField(step2.nationality),
        gender:
          step2.gender === "all" || step2.gender.trim() === ""
            ? null
            : step2.gender,
      },
      step3: sanitizeStep3ForApi(step3),
      step4: { ...step4, salaryComponentIds: [...step4.salaryComponentIds], deductionIds: [...step4.deductionIds] },
      step5: {
        ...step5,
        visualElementIds: [...step5.visualElementIds],
      },
    },
  };
}
