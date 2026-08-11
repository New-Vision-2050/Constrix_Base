import { useQuery } from "@tanstack/react-query";
import { ProjectSafetyApi } from "@/services/api/projects/project-safety";
import { extractProjectSafetyWeeklyReports } from "@/services/api/projects/project-safety/types/response";
import type {
  SafetyWeeklyReportFilters,
  SafetyWeeklyReportRow,
} from "../types";
import { mapSafetyWeeklyReportDto } from "./mapSafetyWeeklyReport";

export const safetyWeeklyReportsQueryKey = (
  projectId?: string,
  filters?: SafetyWeeklyReportFilters,
) =>
  projectId
    ? ([
        "project-safety-weekly-reports",
        projectId,
        filters?.fromDate ?? "",
        filters?.toDate ?? "",
      ] as const)
    : (["project-safety-weekly-reports"] as const);

export function useSafetyWeeklyReports(
  projectId: string | undefined,
  filters: SafetyWeeklyReportFilters,
) {
  return useQuery({
    queryKey: safetyWeeklyReportsQueryKey(projectId, filters),
    queryFn: async (): Promise<SafetyWeeklyReportRow[]> => {
      const res = await ProjectSafetyApi.listWeeklyReportsForProject(
        projectId!,
        {
          ...(filters.fromDate ? { from_date: filters.fromDate } : {}),
          ...(filters.toDate ? { to_date: filters.toDate } : {}),
        },
      );
      const records = extractProjectSafetyWeeklyReports(res.data);
      return records.map((item, index) => mapSafetyWeeklyReportDto(item, index));
    },
    enabled: !!projectId,
    retry: false,
  });
}
