import { useQuery } from "@tanstack/react-query";
import { ProjectSafetyApi } from "@/services/api/projects/project-safety";
import { extractProjectSafetyRecords } from "@/services/api/projects/project-safety/types/response";
import type { SafetyVisitRow } from "@/modules/projects/project/components/project-tabs/tabs/safety/types";
import { mapProjectSafetyDto } from "./mapProjectSafety";

export const projectSafetyQueryKey = (projectId?: string) =>
  projectId ? (["project-safety", projectId] as const) : (["project-safety"] as const);

export function useProjectSafety(projectId: string | undefined) {
  return useQuery({
    queryKey: projectSafetyQueryKey(projectId),
    queryFn: async () => {
      const res = await ProjectSafetyApi.listForProject(projectId!);
      const records = extractProjectSafetyRecords(res.data);
      return records.map((item) => mapProjectSafetyDto(item));
    },
    enabled: !!projectId,
    retry: false,
  });
}
