import { useQuery } from "@tanstack/react-query";
import { ProjectSafetyVisitsApi } from "@/services/api/projects/project-safety/visits/api";
import { extractProjectSafetyRecords } from "@/services/api/projects/project-safety/visits/types";
import type { SafetyVisitRow } from "../types";
import { mapSafetyVisitDto } from "./mapSafetyVisit";

export const safetyVisitsQueryKey = (projectId?: string) =>
  projectId
    ? (["project-safety-visits", projectId] as const)
    : (["project-safety-visits"] as const);

export function useSafetyVisits(projectId: string | undefined) {
  return useQuery({
    queryKey: safetyVisitsQueryKey(projectId),
    queryFn: async (): Promise<SafetyVisitRow[]> => {
      const res = await ProjectSafetyVisitsApi.listForProject(projectId!);
      const records = extractProjectSafetyRecords(res.data);
      return records.map((item) => mapSafetyVisitDto(item));
    },
    enabled: !!projectId,
    retry: false,
  });
}
