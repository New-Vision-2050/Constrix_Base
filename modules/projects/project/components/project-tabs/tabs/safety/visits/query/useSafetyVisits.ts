import { useQuery } from "@tanstack/react-query";
import { ProjectSafetyVisitsApi } from "@/services/api/projects/project-safety/visits/api";
import { extractProjectSafetyRecords } from "@/services/api/projects/project-safety/visits/types";
import type {
  SafetyVisitFilters,
  SafetyVisitRow,
  UseSafetyVisitsParams,
} from "../types";
import { mapSafetyVisitDto } from "./mapSafetyVisit";

export const safetyVisitsQueryKey = (params: {
  projectId?: string;
  search?: string;
  filters?: SafetyVisitFilters;
}) =>
  [
    "project-safety-visits",
    params.projectId,
    params.search ?? "",
    params.filters?.date ?? "",
    params.filters?.consultantEngineer ?? "",
    params.filters?.consultant ?? "",
    params.filters?.contractorId ?? "",
    params.filters?.assignedUserId ?? "",
  ] as const;

export function useSafetyVisits({
  projectId,
  search,
  filters,
}: UseSafetyVisitsParams) {
  return useQuery({
    queryKey: safetyVisitsQueryKey({ projectId, search, filters }),
    queryFn: async (): Promise<SafetyVisitRow[]> => {
      const res = await ProjectSafetyVisitsApi.listForProject(projectId!, {
        search: search?.trim() || undefined,
        date: filters?.date || undefined,
        consultantEngineer: filters?.consultantEngineer || undefined,
        consultant: filters?.consultant || undefined,
        contractorId: filters?.contractorId || undefined,
        assignedUserId: filters?.assignedUserId || undefined,
      });
      const records = extractProjectSafetyRecords(res.data);
      return records.map((item) => mapSafetyVisitDto(item));
    },
    enabled: !!projectId,
    retry: false,
    placeholderData: (prev) => prev,
  });
}
