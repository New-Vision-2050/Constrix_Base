"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { apiClient, baseURL } from "@/config/axios-config";
import { getConstraintsPage } from "@/modules/attendance-departure/api/getConstraints";
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

function resolveWizardFilterId(value: string | undefined): string | undefined {
  if (!value || value === STEP2_FILTER_UNSET || value.trim() === "") {
    return undefined;
  }
  return value.trim();
}

type FetchEmployeesFilters = {
  branchId?: string;
  constraintIds?: string[];
};

async function fetchEmployees(
  filters: FetchEmployeesFilters = {},
): Promise<WizardEmployeeOption[]> {
  const per_page = 100;
  let page = 1;
  let last_page = 1;
  const acc: WizardEmployeeOption[] = [];
  const constraintIds = (filters.constraintIds ?? []).filter(
    (id) => id.trim().length > 0,
  );

  do {
    const params: Record<string, unknown> = { page, per_page };
    if (filters.branchId) params.branch_id = filters.branchId;

    const res = await apiClient.get<EmployeesResponse>("/company-users/employees", {
      params,
      paramsSerializer: (serializedParams) => {
        const searchParams = new URLSearchParams();

        Object.entries(serializedParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });

        for (const id of constraintIds) {
          searchParams.append("constraints_ids[]", id);
        }

        return searchParams.toString();
      },
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

function mapConstraintToWizardOption(item: {
  id: string;
  constraint_name: string;
}): WizardAttendanceConstraintOption {
  const constraint_name =
    String(item.constraint_name ?? "").trim() || String(item.id);
  return {
    id: String(item.id),
    constraint_name,
    is_active: true,
    label: { ar: constraint_name, en: constraint_name },
  };
}

type WizardConstraintsPage = {
  items: WizardAttendanceConstraintOption[];
  hasMore: boolean;
};

type WizardConstraintsSearchFilters = {
  search?: string;
  branchId?: string;
  managementId?: string;
  jobTitleId?: string;
};

async function fetchWizardConstraintsPage(
  page: number,
  filters: WizardConstraintsSearchFilters,
): Promise<WizardConstraintsPage> {
  const trimmedSearch = filters.search?.trim();
  const result = await getConstraintsPage(
    page,
    trimmedSearch && trimmedSearch.length > 0 ? trimmedSearch : undefined,
    {
      branch_id: resolveWizardFilterId(filters.branchId),
      management_id: resolveWizardFilterId(filters.managementId),
      job_title_id: resolveWizardFilterId(filters.jobTitleId),
    },
  );

  return {
    items: result.items.map(mapConstraintToWizardOption),
    hasMore: result.hasMore,
  };
}

const CONSTRAINT_SEARCH_DEBOUNCE_MS = 300;

export function useAttendanceWizardAttendanceConstraintsSearch(
  filters: WizardConstraintsSearchFilters,
) {
  const trimmedSearch = filters.search?.trim() ?? "";
  const branchId = resolveWizardFilterId(filters.branchId);
  const managementId = resolveWizardFilterId(filters.managementId);
  const jobTitleId = resolveWizardFilterId(filters.jobTitleId);

  return useInfiniteQuery({
    queryKey: [
      "hr-attendance-wizard-attendance-constraints",
      trimmedSearch,
      branchId ?? "",
      managementId ?? "",
      jobTitleId ?? "",
    ],
    queryFn: ({ pageParam }) =>
      fetchWizardConstraintsPage(pageParam, {
        search: trimmedSearch,
        branchId: filters.branchId,
        managementId: filters.managementId,
        jobTitleId: filters.jobTitleId,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.hasMore ? lastPageParam + 1 : undefined,
    staleTime: 60_000,
  });
}

export { CONSTRAINT_SEARCH_DEBOUNCE_MS };

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
  attendanceConstraintIds?: string[];
}) {
  const branchFilter = resolveWizardBranchFilter(options.branchId);
  const constraintIds = [...(options.attendanceConstraintIds ?? [])]
    .map((id) => id.trim())
    .filter(Boolean)
    .sort();

  return useQuery({
    queryKey: [
      "hr-attendance-wizard-employees",
      branchFilter ?? "all",
      constraintIds,
    ],
    queryFn: () =>
      fetchEmployees({
        branchId: branchFilter,
        constraintIds: options.attendanceConstraintIds,
      }),
    enabled: options.enabled,
    staleTime: 60_000,
  });
}
