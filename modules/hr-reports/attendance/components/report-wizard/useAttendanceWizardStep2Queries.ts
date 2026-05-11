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

async function fetchEmployeesByBranch(branchId: string): Promise<
  WizardEmployeeOption[]
> {
  const per_page = 100;
  let page = 1;
  let last_page = 1;
  const acc: WizardEmployeeOption[] = [];

  do {
    const res = await apiClient.get<EmployeesResponse>("/company-users/employees", {
      params: { branch_id: branchId, page, per_page },
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

export function useAttendanceWizardEmployees(branchId: string | undefined) {
  const enabled =
    Boolean(branchId) &&
    branchId !== STEP2_FILTER_UNSET &&
    String(branchId).trim().length > 0;

  return useQuery({
    queryKey: ["hr-attendance-wizard-employees", branchId],
    queryFn: () => fetchEmployeesByBranch(String(branchId!).trim()),
    enabled,
    staleTime: 60_000,
  });
}
