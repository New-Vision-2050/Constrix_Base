import type { SalaryComponentId, SalaryDeductionId } from "./types";

/** Section 1 — column “a” matches mock column 1 (right in RTL). */
export const SALARY_COMPONENT_OPTIONS: {
  id: SalaryComponentId;
  column: "a" | "b";
}[] = [
  { id: "basic_salary", column: "a" },
  { id: "transportation", column: "a" },
  { id: "phone", column: "a" },
  { id: "overtime_allowance", column: "a" },
  { id: "housing", column: "b" },
  { id: "food", column: "b" },
  { id: "representation", column: "b" },
  { id: "bonuses", column: "b" },
];

export const SALARY_DEDUCTION_OPTIONS: {
  id: SalaryDeductionId;
  column: "a" | "b";
}[] = [
  { id: "absence_deduction", column: "a" },
  { id: "social_insurance", column: "a" },
  { id: "disciplinary", column: "a" },
  { id: "delay_deduction", column: "b" },
  { id: "advances_loans", column: "b" },
  { id: "income_tax", column: "b" },
];

export const DISBURSEMENT_STATUS_VALUES = [
  "all",
  "disbursed",
  "pending_approval",
  "suspended",
] as const;
