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

export type ChartSliceItem = {
  label: string;
  value: number;
  percentage: number;
  code?: string;
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

export function filterContractorConsultantRows<
  T extends {
    contractorName: string;
    consultant: string;
  },
>(rows: T[], filters: SafetyIndicatorFilters): T[] {
  return rows.filter((row) => {
    if (filters.contractor && row.contractorName !== filters.contractor) {
      return false;
    }
    if (filters.consultant && row.consultant !== filters.consultant) {
      return false;
    }
    return true;
  });
}
