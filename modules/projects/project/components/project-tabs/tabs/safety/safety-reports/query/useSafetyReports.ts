import { useQuery } from "@tanstack/react-query";
import { ProjectSafetyReportsApi } from "@/services/api/projects/project-safety/safety-reports/api";
import { extractProjectSafetyReports } from "@/services/api/projects/project-safety/safety-reports/types";
import type { SafetyReportRow } from "../types";
import { mapSafetyReportDto } from "./mapSafetyReport";

export const safetyReportsQueryKey = (projectId?: string) =>
  projectId
    ? (["project-safety-reports", projectId] as const)
    : (["project-safety-reports"] as const);

export function useSafetyReports(projectId: string | undefined) {
  return useQuery({
    queryKey: safetyReportsQueryKey(projectId),
    queryFn: async (): Promise<SafetyReportRow[]> => {
      const res = await ProjectSafetyReportsApi.listForProject(projectId!);
      const records = extractProjectSafetyReports(res.data);
      return records.map((item) => mapSafetyReportDto(item));
    },
    enabled: !!projectId,
    retry: false,
  });
}
