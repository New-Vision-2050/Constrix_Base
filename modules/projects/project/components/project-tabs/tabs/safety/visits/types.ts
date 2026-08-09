/** Positive = no violation, zero = not applicable, negative = violation exists. */
export type SafetyViolationStatus = number | null;

export type SafetyViolationEvidence = {
  id: number;
  name: string;
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
};

export type SafetyViolation = {
  id: string;
  code: string;
  description: string;
  category: string;
  isAttached: boolean;
  weight: string | null;
  action: string | null;
  evidence: SafetyViolationEvidence[];
  status: SafetyViolationStatus;
};

export function isImageEvidence(
  evidence: SafetyViolationEvidence,
): boolean {
  if (evidence.mimeType.startsWith("image/")) return true;
  const ext = evidence.fileName.split(".").pop()?.toLowerCase();
  return ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(
    ext ?? "",
  );
}

export function parseViolationWeight(weight: string | null): number | null {
  if (weight === null || weight.trim() === "") return null;
  const num = Number(weight);
  return Number.isNaN(num) ? null : num;
}

export function getSafetyViolationWeightLabel(
  weight: string | null,
): string | null {
  const num = parseViolationWeight(weight);
  if (num === null) return null;
  if (num > 0) return "لا يوجد مخالفة";
  if (num === 0) return "لا ينطبق";
  if (num < 0) return "يوجد مخالفة";
  return null;
}

export const SAFETY_VIOLATION_PENDING_VALUE = "-";

export function getSafetyViolationDisplayLabel(
  status: SafetyViolationStatus,
  weight: string | null,
): string {
  if (status === null || status === undefined) {
    return SAFETY_VIOLATION_PENDING_VALUE;
  }

  return getSafetyViolationWeightLabel(weight) ?? "_";
}

export type SafetyVisitRow = {
  id: string;
  workOrderNumber: string;
  workOrderType: string;
  date: string;
  time: string;
  requiredGrade: number;
  earnedGrade: number;
  percentage: number;
  consultantEngineer: string;
  consultant: string;
  contractorId: string;
  contractorName: string;
  violations: SafetyViolation[];
  violationValues: Record<string, string>;
  status: string;
};

export type SafetyVisitFilters = {
  date: string;
  consultantEngineer: string;
  consultant: string;
  contractorId: string;
  assignedUserId: string;
};

export const EMPTY_SAFETY_VISIT_FILTERS: SafetyVisitFilters = {
  date: "",
  consultantEngineer: "",
  consultant: "",
  contractorId: "",
  assignedUserId: "",
};

export const SAFETY_VISIT_BASE_COLUMN_KEYS = [
  "workOrderNumber",
  "workOrderType",
  "date",
  "requiredGrade",
  "earnedGrade",
  "percentage",
  "consultantEngineer",
  "consultant",
  "contractorName",
] as const;

export type SafetyVisitBaseColumnKey =
  (typeof SAFETY_VISIT_BASE_COLUMN_KEYS)[number];

export type UseSafetyVisitsParams = {
  projectId: string | undefined;
  page?: number;
  perPage?: number;
  search?: string;
  filters?: SafetyVisitFilters;
};

export type SafetyVisitsQueryResult = {
  data: SafetyVisitRow[];
  pagination: {
    page: number;
    next_page: number | null;
    last_page: number;
    result_count: number;
  };
};
