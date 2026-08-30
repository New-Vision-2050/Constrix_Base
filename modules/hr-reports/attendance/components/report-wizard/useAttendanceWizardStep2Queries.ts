"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient, baseURL } from "@/config/axios-config";
import { fetchManagementHierarchyOptions } from "@/utils/fetchDropdownOptions";
import { STEP2_FILTER_UNSET } from "./constants-step2";

export type WizardEmployeeOption = { id: string; name: string };

type EmployeesResponse = {
  payload?: Array<{ id?: unknown; name?: unknown }>;
  pagination?: { last_page?: number };
};

function normalizeEmployeeRows(data: unknown): WizardEmployeeOption[] {
  if (!data || typeof data !== "object") return [];
  const maybePayload = data as EmployeesResponse;
  const raw =
    Array.isArray(maybePayload.payload) ? maybePayload.payload : [];

  return raw
    .map((row) => ({
      id: String(row?.id ?? ""),
      name:
        String(row?.name ?? "")
          .trim() || String(row?.id ?? ""),
    }))
    .filter((r) => r.id.length > 0);
}

function resolveWizardBranchFilter(
  branchId: string | undefined,
): string | undefined {
  if (!branchId || branchId === STEP2_FILTER_UNSET || branchId.trim() === "") {
    return undefined;
  }
  return branchId.trim();
}

async function fetchEmployees(
  branchId?: string,
): Promise<WizardEmployeeOption[]> {
  const per_page = 100;
  let page = 1;
  let last_page = 1;
  const acc: WizardEmployeeOption[] = [];

  do {
    const params: Record<string, unknown> = { page, per_page };
    if (branchId) params.branch_id = branchId;

    const res = await apiClient.get<EmployeesResponse>("/company-users/employees", {
      params,
    });
    const data = res.data;
    last_page = data?.pagination?.last_page ?? 1;
    acc.push(...normalizeEmployeeRows(data));
    page += 1;
  } while (page <= last_page && page < 50);

  const seen = new Set<string>();
  return acc.filter((e) => {
    if (seen.has(e.id)) return false;
    seen.add(e.id);
    return true;
  });
}

export function useAttendanceWizardBranches() {
  return useQuery({
    queryKey: ["hr-attendance-wizard-branches"],
    queryFn: () =>
      fetchManagementHierarchyOptions(
        `${baseURL}/management_hierarchies/list?type=branch`,
      ),
    staleTime: 5 * 60_000,
  });
}

export function useAttendanceWizardManagements(branchId: string | undefined) {
  const enabled =
    Boolean(branchId) &&
    branchId !== STEP2_FILTER_UNSET &&
    String(branchId).trim().length > 0;

  return useQuery({
    queryKey: ["hr-attendance-wizard-managements", branchId],
    queryFn: () =>
      fetchManagementHierarchyOptions(
        `${baseURL}/management_hierarchies/list?type=management&branch_id=${encodeURIComponent(
          String(branchId),
        )}`,
      ),
    enabled,
    staleTime: 60_000,
  });
}

export type WizardAttendanceConstraintOption = {
  id: string;
  constraint_name: string;
  is_active: boolean;
  label: { ar: string; en: string };
};

type ReportsLookupsResponse = {
  payload?: {
    attendance_constraints?: Array<{
      id?: unknown;
      constraint_name?: unknown;
      is_active?: unknown;
      label?: { ar?: unknown; en?: unknown };
    }>;
  };
};

function normalizeAttendanceConstraints(
  data: unknown,
): WizardAttendanceConstraintOption[] {
  if (!data || typeof data !== "object") return [];
  const maybePayload = data as ReportsLookupsResponse;
  const raw = maybePayload.payload?.attendance_constraints;
  if (!Array.isArray(raw)) return [];

  return raw
    .map((row) => {
      const id = String(row?.id ?? "");
      const constraint_name = String(row?.constraint_name ?? "").trim();
      if (!id || !constraint_name) return null;
      const labelAr = String(row?.label?.ar ?? constraint_name).trim();
      const labelEn = String(row?.label?.en ?? constraint_name).trim();
      return {
        id,
        constraint_name,
        is_active: row?.is_active !== false,
        label: { ar: labelAr, en: labelEn },
      } satisfies WizardAttendanceConstraintOption;
    })
    .filter(
      (r): r is WizardAttendanceConstraintOption => r !== null,
    );
}

export function useAttendanceWizardAttendanceConstraints() {
  return useQuery({
    queryKey: ["hr-attendance-wizard-attendance-constraints"],
    queryFn: async () => {
      const res = await apiClient.get<ReportsLookupsResponse>(
        "/reports/lookups",
      );
      return normalizeAttendanceConstraints(res.data);
    },
    staleTime: 5 * 60_000,
  });
}

export type WizardJobTitleOption = { id: string; name: string };

export function useAttendanceWizardJobTitles() {
  return useQuery({
    queryKey: ["hr-attendance-wizard-job-titles"],
    queryFn: async () => {
      const res = await apiClient.get(`/job_titles/list`, {
        params: { per_page: 200, page: 1 },
      });
      const rows = res.data?.payload ?? res.data ?? [];
      if (!Array.isArray(rows)) return [] as WizardJobTitleOption[];
      return rows
        .map((r: { id?: unknown; name?: unknown }) => ({
          id: String(r.id ?? ""),
          name: String(r.name ?? "").trim(),
        }))
        .filter((r: WizardJobTitleOption) => r.id.length > 0);
    },
    staleTime: 5 * 60_000,
  });
}

export function useAttendanceWizardEmployees(options: {
  enabled: boolean;
  branchId: string;
}) {
  const branchFilter = resolveWizardBranchFilter(options.branchId);

  return useQuery({
    queryKey: ["hr-attendance-wizard-employees", branchFilter ?? "all"],
    queryFn: () => fetchEmployees(branchFilter),
    enabled: options.enabled,
    staleTime: 60_000,
  });
}
