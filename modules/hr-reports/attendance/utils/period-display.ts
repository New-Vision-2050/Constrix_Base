import { ensureOrderedRange } from "../components/report-wizard/step1-date-range";
import type { ReportWizardStep1 } from "../components/report-wizard/types";

export type DateRangeIso = { dateFrom: string; dateTo: string };

const ISO_DATE = /(\d{4}-\d{2}-\d{2})/g;
const DMY_DATE = /(\d{2})-(\d{2})-(\d{4})/g;

function dmyToIso(m: RegExpMatchArray): string {
  return `${m[3]}-${m[2]}-${m[1]}`;
}

/** Parse one or more date tokens from report titles (ISO, DMY, or mixed). */
export function extractDateRangeFromTexts(
  ...texts: (string | undefined | null)[]
): DateRangeIso | null {
  const iso: string[] = [];
  const dmy: string[] = [];

  for (const raw of texts) {
    if (typeof raw !== "string" || raw.trim() === "") continue;
    const text = raw.trim();
    for (const m of text.matchAll(ISO_DATE)) iso.push(m[1]);
    for (const m of text.matchAll(DMY_DATE)) dmy.push(dmyToIso(m));
  }

  if (iso.length >= 2) {
    const sorted = [...iso].sort();
    return ensureOrderedRange(sorted[0], sorted[sorted.length - 1]);
  }
  if (dmy.length >= 2) {
    const sorted = [...dmy].sort();
    return ensureOrderedRange(sorted[0], sorted[sorted.length - 1]);
  }
  if (iso.length === 1 && dmy.length >= 1) {
    return ensureOrderedRange(iso[0], dmy[dmy.length - 1]);
  }
  if (dmy.length === 1 && iso.length >= 1) {
    return ensureOrderedRange(iso[0], dmy[0]);
  }
  return null;
}

export function extractDateRangeFromReportName(apiName?: {
  ar?: string;
  en?: string;
}): DateRangeIso | null {
  return extractDateRangeFromTexts(apiName?.en, apiName?.ar);
}

export function formatPeriodRangeLabel(range: DateRangeIso): string {
  return `${range.dateFrom} – ${range.dateTo}`;
}

function orderedRangeFromStep1(step1: ReportWizardStep1): DateRangeIso | null {
  const from = step1.dateFrom?.trim() ?? "";
  const to = step1.dateTo?.trim() ?? "";
  if (!from || !to) return null;
  return ensureOrderedRange(from, to);
}

export function resolveReportPeriodLabel(
  step1: ReportWizardStep1,
  formatLegacy: () => string,
  apiName?: { ar?: string; en?: string },
  extraTexts?: (string | undefined)[],
): string {
  if (step1.periodType !== "range") {
    return formatLegacy();
  }

  const fromConfig = orderedRangeFromStep1(step1);
  const fromName = extractDateRangeFromTexts(
    ...(extraTexts ?? []),
    apiName?.en,
    apiName?.ar,
  );

  if (fromName && fromConfig) {
    const configSingleMonth =
      fromConfig.dateFrom.slice(0, 7) === fromConfig.dateTo.slice(0, 7);
    const nameSpansMonths =
      fromName.dateFrom.slice(0, 7) !== fromName.dateTo.slice(0, 7);
    if (configSingleMonth && nameSpansMonths) {
      return formatPeriodRangeLabel(fromName);
    }
    return formatPeriodRangeLabel(fromConfig);
  }

  if (fromName) return formatPeriodRangeLabel(fromName);
  if (fromConfig) return formatPeriodRangeLabel(fromConfig);
  return formatLegacy();
}
