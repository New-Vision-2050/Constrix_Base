import { useQuery } from "@tanstack/react-query";
import { ProjectSafetyApi } from "@/services/api/projects/project-safety";
import { extractProjectSafetyReports } from "@/services/api/projects/project-safety/types/report-response";
import type { SafetyReportRow } from "@/modules/projects/project/components/project-tabs/tabs/safety/safety-report-types";
import { mapProjectSafetyReportDto } from "./mapProjectSafetyReport";

export const projectSafetyReportsQueryKey = (projectId?: string) =>
  projectId
    ? (["project-safety-reports", projectId] as const)
    : (["project-safety-reports"] as const);

export function useProjectSafetyReports(projectId: string | undefined) {
  return useQuery({
    queryKey: projectSafetyReportsQueryKey(projectId),
    queryFn: async (): Promise<SafetyReportRow[]> => {
      const res = await ProjectSafetyApi.listReportsForProject(projectId!);
      const records = extractProjectSafetyReports(res.data);
      return records.map((item) => mapProjectSafetyReportDto(item));
    },
    enabled: !!projectId,
    retry: false,
  });
}
