export type SafetyViolation = {
  id: string;
  code: string;
  description: string;
  category: string;
  isAttached: boolean;
  weight: number | null;
};

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
  contractor: string;
  violations: SafetyViolation[];
  violationValues: Record<string, string>;
};

export type SafetyVisitFilters = {
  orderNumber: string;
  contractor: string;
  consultant: string;
  engineer: string;
  date: string;
};

export const EMPTY_SAFETY_VISIT_FILTERS: SafetyVisitFilters = {
  orderNumber: "",
  contractor: "",
  consultant: "",
  engineer: "",
  date: "",
};

export const SAFETY_VISIT_BASE_COLUMN_KEYS = [
  "workOrderNumber",
  "workOrderType",
  "date",
  "time",
  "requiredGrade",
  "earnedGrade",
  "percentage",
  "consultantEngineer",
  "consultant",
  "contractor",
] as const;

export type SafetyVisitBaseColumnKey =
  (typeof SAFETY_VISIT_BASE_COLUMN_KEYS)[number];
