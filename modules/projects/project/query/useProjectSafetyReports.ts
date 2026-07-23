import { useQuery } from "@tanstack/react-query";
import { ProjectSafetyApi } from "@/services/api/projects/project-safety";
import { extractProjectSafetyReports } from "@/services/api/projects/project-safety/types/report-response";
import {
  MOCK_SAFETY_REPORTS,
  type SafetyReportRow,
} from "@/modules/projects/project/components/project-tabs/tabs/safety/safety-report-types";
import { mapProjectSafetyReportDto } from "./mapProjectSafetyReport";

export const projectSafetyReportsQueryKey = (projectId?: string) =>
  projectId
    ? (["project-safety-reports", projectId] as const)
    : (["project-safety-reports"] as const);

export function useProjectSafetyReports(projectId: string | undefined) {
  return useQuery({
    queryKey: projectSafetyReportsQueryKey(projectId),
    queryFn: async () => {
      try {
        const res = await ProjectSafetyApi.listReportsForProject(projectId!);
        const records = extractProjectSafetyReports(res.data);
        if (records.length > 0) {
          return records.map((item) => mapProjectSafetyReportDto(item));
        }
      } catch {
        // Fallback to mock data until the reports API is available.
      }

      return MOCK_SAFETY_REPORTS as SafetyReportRow[];
    },
    enabled: !!projectId,
    retry: false,
  });
}
