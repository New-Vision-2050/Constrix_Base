import { useQuery } from "@tanstack/react-query";
import { ProjectSafetyApi } from "@/services/api/projects/project-safety";
import {
  extractProjectSafetyRecords,
  type ProjectSafetyVisitsListPagination,
} from "@/services/api/projects/project-safety/types/response";
import type {
  SafetyVisitFilters,
  SafetyVisitsQueryResult,
  UseSafetyVisitsParams,
} from "../types";
import { mapSafetyVisitDto } from "./mapSafetyVisit";

export const safetyVisitsQueryKey = (params: {
  projectId?: string;
  page?: number;
  perPage?: number;
  search?: string;
  filters?: SafetyVisitFilters;
}) =>
  [
    "project-safety-visits",
    params.projectId,
    params.page ?? 1,
    params.perPage ?? 10,
    params.search ?? "",
    params.filters?.date ?? "",
    params.filters?.consultantEngineer ?? "",
    params.filters?.consultant ?? "",
    params.filters?.contractorId ?? "",
    params.filters?.assignedUserId ?? "",
  ] as const;

function resolvePagination(
  body: {
    pagination?: ProjectSafetyVisitsListPagination;
    last_page?: number;
    total?: number;
  },
  rowCount: number,
  page: number,
  perPage: number,
  needsClientSlice: boolean,
): SafetyVisitsQueryResult["pagination"] {
  const totalItems =
    body.pagination?.result_count ?? body.total ?? rowCount;
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));

  if (needsClientSlice) {
    return {
      page,
      next_page: page < totalPages ? page + 1 : null,
      last_page: totalPages,
      result_count: totalItems,
    };
  }

  const pagination = body.pagination;
  if (pagination) {
    return {
      page: pagination.page ?? page,
      next_page: pagination.next_page ?? null,
      last_page: pagination.last_page ?? totalPages,
      result_count: pagination.result_count ?? totalItems,
    };
  }

  return {
    page,
    next_page: page < totalPages ? page + 1 : null,
    last_page: body.last_page ?? totalPages,
    result_count: totalItems,
  };
}

function paginateRows<T>(rows: T[], page: number, perPage: number): T[] {
  const start = (page - 1) * perPage;
  return rows.slice(start, start + perPage);
}

export function useSafetyVisits({
  projectId,
  page = 1,
  perPage = 10,
  search,
  filters,
}: UseSafetyVisitsParams) {
  return useQuery({
    queryKey: safetyVisitsQueryKey({ projectId, page, perPage, search, filters }),
    queryFn: async (): Promise<SafetyVisitsQueryResult> => {
      const res = await ProjectSafetyApi.listVisitsForProject(projectId!, {
        page,
        per_page: perPage,
        search: search?.trim() || undefined,
        date: filters?.date || undefined,
        consultantEngineer: filters?.consultantEngineer || undefined,
        consultant: filters?.consultant || undefined,
        contractorId: filters?.contractorId || undefined,
        assignedUserId: filters?.assignedUserId || undefined,
      });
      const body = res.data;
      const records = extractProjectSafetyRecords(body);
      const allRows = records.map((item) => mapSafetyVisitDto(item));
      const needsClientSlice = allRows.length > perPage;
      const data = needsClientSlice
        ? paginateRows(allRows, page, perPage)
        : allRows;

      return {
        data,
        pagination: resolvePagination(
          body,
          allRows.length,
          page,
          perPage,
          needsClientSlice,
        ),
      };
    },
    enabled: !!projectId,
    retry: false,
  });
}
