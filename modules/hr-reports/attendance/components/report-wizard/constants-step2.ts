import type { EmployeeContractTypeId } from "./types";

/** MUI Select treats `value=""` as empty → label overlaps selected text; use this for “no filter”. */
export const STEP2_FILTER_UNSET = "__filter_unset__" as const;

export const EMPLOYEE_CONTRACT_OPTIONS: {
  id: EmployeeContractTypeId;
}[] = [
  { id: "full_time" },
  { id: "part_time" },
  { id: "temporary" },
  { id: "intern" },
  { id: "external_consultant" },
  { id: "seasonal" },
];

export const STEP2_LOCATION_VALUES = ["jeddah", "riyadh", "dammam", "remote"] as const;
export const STEP2_MANAGEMENT_VALUES = ["hr", "finance", "operations", "sales"] as const;
export const STEP2_DEPARTMENT_VALUES = [
  "recruitment",
  "training",
  "payroll",
  "relations",
] as const;
export const STEP2_JOB_TITLE_VALUES = ["hr", "accountant", "developer", "manager"] as const;
export const STEP2_NATIONALITY_VALUES = [
  "saudi",
  "egyptian",
  "indian",
  "pakistani",
  "other",
] as const;
export const STEP2_GENDER_VALUES = ["all", "male", "female"] as const;
