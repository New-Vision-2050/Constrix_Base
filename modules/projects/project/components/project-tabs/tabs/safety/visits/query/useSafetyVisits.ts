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
): SafetyVisitsQueryResult["pagination"] {
  const pagination = body.pagination;
  if (pagination) {
    return {
      page: pagination.page ?? 1,
      next_page: pagination.next_page ?? null,
      last_page: pagination.last_page ?? 1,
      result_count: pagination.result_count ?? rowCount,
    };
  }

  return {
    page: 1,
    next_page: null,
    last_page: body.last_page ?? 1,
    result_count: body.total ?? rowCount,
  };
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
      const data = records.map((item) => mapSafetyVisitDto(item));

      return {
        data,
        pagination: resolvePagination(body, data.length),
      };
    },
    enabled: !!projectId,
    retry: false,
    placeholderData: (prev) => prev,
  });
}
