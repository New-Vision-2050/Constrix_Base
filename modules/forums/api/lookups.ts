import { apiClient } from "@/config/axios-config";
import { cleanParams } from "./client";
import type { EmployeeOption } from "../types";

type RawRow = Record<string, unknown>;

function readRows(data: unknown): RawRow[] {
  const payload = (data as { payload?: unknown })?.payload;
  if (Array.isArray(payload)) return payload as RawRow[];
  const nested = (data as { data?: unknown })?.data;
  return Array.isArray(nested) ? (nested as RawRow[]) : [];
}

function text(value: unknown): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  return String(value);
}

function toEmployee(row: RawRow): EmployeeOption {
  return {
    id: String(row.id ?? row.user_id ?? ""),
    name: String(row.name ?? row.full_name ?? row.id ?? ""),
    email: text(row.email),
    job_title: text(
      row.job_title ?? (row.job_title_name as unknown) ?? row.jobTitle,
    ),
    branch_name: text(
      row.branch_name ?? row.management_name ?? row.department_name,
    ),
    employee_number: text(row.employee_number ?? row.job_number ?? row.code),
    avatar_url: text(row.avatar_url ?? row.image ?? row.avatar) ?? null,
  };
}

/**
 * Employee directory for every picker in the module.
 *
 * The spec names `GET /employees`; this repo has always used
 * `company-users/employees`, so the first call falls back to the second when the
 * spec route is not deployed.
 */
export async function searchEmployees(params: {
  search?: string;
  branch_id?: string;
  project_id?: string;
  per_page?: number;
}): Promise<EmployeeOption[]> {
  const { search, branch_id, project_id, per_page = 50 } = params;

  try {
    const response = await apiClient.get("/employees", {
      params: cleanParams({ search, branch_id, project_id, per_page }),
    });
    return readRows(response.data)
      .map(toEmployee)
      .filter((employee) => employee.id);
  } catch {
    const response = await apiClient.get("/company-users/employees", {
      params: cleanParams({ name: search, branch_id, per_page }),
    });
    return readRows(response.data)
      .map(toEmployee)
      .filter((employee) => employee.id);
  }
}

export type LookupOption = { id: string; name: string };

function toOption(row: RawRow): LookupOption {
  return {
    id: String(row.id ?? ""),
    name: String(row.name ?? row.title ?? "").trim(),
  };
}

/** Company-structure units (الفروع). */
export async function getBranchOptions(): Promise<LookupOption[]> {
  const response = await apiClient.get("/management_hierarchies/list", {
    params: { type: "branch" },
  });
  return readRows(response.data)
    .map(toOption)
    .filter((option) => option.id && option.name);
}

/** Company-structure managements (الإدارات). */
export async function getManagementOptions(
  branchId?: string,
): Promise<LookupOption[]> {
  const response = await apiClient.get("/management_hierarchies/list", {
    params: cleanParams({ type: "management", branch_id: branchId }),
  });
  return readRows(response.data)
    .map(toOption)
    .filter((option) => option.id && option.name);
}

/** Projects (المشاريع). */
export async function getProjectOptions(): Promise<LookupOption[]> {
  const response = await apiClient.get("/projects", {
    params: { per_page: 100 },
  });
  return readRows(response.data)
    .map(toOption)
    .filter((option) => option.id && option.name);
}
