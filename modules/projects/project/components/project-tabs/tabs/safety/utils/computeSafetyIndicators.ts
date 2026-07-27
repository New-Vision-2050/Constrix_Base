import type { SafetyVisitRow } from "../types";

export type SafetyIndicatorFilters = {
  dateFrom: string;
  dateTo: string;
  contractor: string;
  consultant: string;
};

export const EMPTY_SAFETY_INDICATOR_FILTERS: SafetyIndicatorFilters = {
  dateFrom: "",
  dateTo: "",
  contractor: "",
  consultant: "",
};

export type RatingBand = "excellent" | "good" | "attention" | "critical";

export type MonthlyAssessmentItem = {
  label: string;
  percentage: number;
  band: RatingBand;
};

export type ChartSliceItem = {
  label: string;
  value: number;
  percentage: number;
  code?: string;
};

export type SafetyIndicatorsData = {
  overallRating: number;
  committedSites: number;
  highRiskObservations: number;
  repeatedViolations: number;
  monthlyAssessment: MonthlyAssessmentItem[];
  contractorConsultantErrors: ChartSliceItem[];
  topViolations: ChartSliceItem[];
  ratingSparkline: { value: number }[];
  committedSparkline: { value: number }[];
  highRiskSparkline: { value: number }[];
  repeatedSparkline: { value: number }[];
};

export function getRatingBand(percentage: number): RatingBand {
  if (percentage >= 90) return "excellent";
  if (percentage >= 70) return "good";
  if (percentage >= 50) return "attention";
  return "critical";
}

export function getRatingColor(band: RatingBand): string {
  switch (band) {
    case "excellent":
      return "#22C55E";
    case "good":
      return "#EAB308";
    case "attention":
      return "#F97316";
    case "critical":
      return "#EF4444";
  }
}

export function filterVisitsForIndicators(
  rows: SafetyVisitRow[],
  filters: SafetyIndicatorFilters,
): SafetyVisitRow[] {
  return rows.filter((row) => {
    if (filters.contractor && row.contractor !== filters.contractor) {
      return false;
    }
    if (filters.consultant && row.consultant !== filters.consultant) {
      return false;
    }
    if (filters.dateFrom && row.date < filters.dateFrom) {
      return false;
    }
    if (filters.dateTo && row.date > filters.dateTo) {
      return false;
    }
    return true;
  });
}

function average(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function formatMonthLabel(isoDate: string, locale: string): string {
  const [year, month] = isoDate.split("-").map(Number);
  if (!year || !month) return isoDate;
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString(locale, { month: "long", year: "numeric" });
}

function getAttachedViolations(row: SafetyVisitRow) {
  return row.violations.filter((violation) => violation.isAttached);
}

function isCategoryA(violation: SafetyVisitRow["violations"][number]) {
  return violation.category === "A";
}

export function computeSafetyIndicators(
  rows: SafetyVisitRow[],
  locale: string,
): SafetyIndicatorsData {
  const percentages = rows.map((row) => row.percentage);
  const overallRating = Math.round(average(percentages));

  const committedSites = new Set(
    rows.filter((row) => row.percentage >= 70).map((row) => row.workOrderNumber),
  ).size;

  const highRiskObservations = rows.reduce((count, row) => {
    const categoryAViolations = getAttachedViolations(row).filter(isCategoryA);
    const isCriticalVisit = row.percentage < 50;
    return count + categoryAViolations.length + (isCriticalVisit ? 1 : 0);
  }, 0);

  const violationVisitCounts = new Map<string, Set<string>>();
  rows.forEach((row) => {
    getAttachedViolations(row).forEach((violation) => {
      const key = violation.code || violation.id;
      if (!violationVisitCounts.has(key)) {
        violationVisitCounts.set(key, new Set());
      }
      violationVisitCounts.get(key)!.add(row.id);
    });
  });

  const repeatedViolations = [...violationVisitCounts.values()].filter(
    (visitIds) => visitIds.size > 1,
  ).length;

  const monthlyMap = new Map<string, number[]>();
  rows.forEach((row) => {
    if (!row.date) return;
    const monthKey = row.date.slice(0, 7);
    if (!monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, []);
    }
    monthlyMap.get(monthKey)!.push(row.percentage);
  });

  const monthlyAssessment = [...monthlyMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([monthKey, values]) => {
      const percentage = Math.round(average(values));
      return {
        label: formatMonthLabel(`${monthKey}-01`, locale),
        percentage,
        band: getRatingBand(percentage),
      };
    });

  const contractorConsultantMap = new Map<string, number>();
  rows.forEach((row) => {
    const label = [row.contractor, row.consultant].filter(Boolean).join(" — ") || "—";
    const violationCount = getAttachedViolations(row).length;
    contractorConsultantMap.set(
      label,
      (contractorConsultantMap.get(label) ?? 0) + violationCount,
    );
  });

  const contractorConsultantTotal = [...contractorConsultantMap.values()].reduce(
    (sum, value) => sum + value,
    0,
  );

  const contractorConsultantErrors = [...contractorConsultantMap.entries()]
    .filter(([, value]) => value > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([label, value]) => ({
      label,
      value,
      percentage:
        contractorConsultantTotal > 0
          ? Math.round((value / contractorConsultantTotal) * 1000) / 10
          : 0,
    }));

  const violationCountMap = new Map<
    string,
    { label: string; count: number; code: string }
  >();

  rows.forEach((row) => {
    getAttachedViolations(row).forEach((violation) => {
      const code = violation.code || violation.id;
      const label = violation.description || code;
      const existing = violationCountMap.get(code);
      if (existing) {
        existing.count += 1;
      } else {
        violationCountMap.set(code, { label, count: 1, code });
      }
    });
  });

  const violationsTotal = [...violationCountMap.values()].reduce(
    (sum, item) => sum + item.count,
    0,
  );

  const topViolations = [...violationCountMap.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map((item) => ({
      label: item.label,
      value: item.count,
      percentage:
        violationsTotal > 0
          ? Math.round((item.count / violationsTotal) * 1000) / 10
          : 0,
      code: item.code,
    }));

  const buildCumulativeSparkline = (values: number[]) =>
    values.map((value, index) => ({
      value: Math.round(average(values.slice(0, index + 1))),
    }));

  const sortedByDate = [...rows].sort((a, b) => a.date.localeCompare(b.date));
  const ratingValues = sortedByDate.map((row) => row.percentage);
  const committedValues = sortedByDate.map((row) =>
    row.percentage >= 70 ? 1 : 0,
  );
  const highRiskValues = sortedByDate.map((row) => {
    const categoryA = getAttachedViolations(row).filter(isCategoryA).length;
    return categoryA + (row.percentage < 50 ? 1 : 0);
  });
  const repeatedValues = sortedByDate.map((row, index) => {
    const priorRows = sortedByDate.slice(0, index + 1);
    const counts = new Map<string, Set<string>>();
    priorRows.forEach((visit) => {
      getAttachedViolations(visit).forEach((violation) => {
        const key = violation.code || violation.id;
        if (!counts.has(key)) counts.set(key, new Set());
        counts.get(key)!.add(visit.id);
      });
    });
    return [...counts.values()].filter((ids) => ids.size > 1).length;
  });

  return {
    overallRating,
    committedSites,
    highRiskObservations,
    repeatedViolations,
    monthlyAssessment,
    contractorConsultantErrors,
    topViolations,
    ratingSparkline: buildCumulativeSparkline(ratingValues),
    committedSparkline: buildCumulativeSparkline(committedValues),
    highRiskSparkline: buildCumulativeSparkline(highRiskValues),
    repeatedSparkline: buildCumulativeSparkline(repeatedValues),
  };
}
