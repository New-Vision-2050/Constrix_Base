import { useQuery } from "@tanstack/react-query";
import { AllProjectsApi } from "@/services/api/projects/all-projects";
import type { Employee } from "@/modules/projects/project/components/project-tabs/tabs/staff/types";
import { mapProjectEmployeeDto } from "./mapProjectEmployee";

export const projectEmployeesByCompanyQueryKey = (
  projectId: string,
  companyId: string,
) => ["project-employees-by-company", projectId, companyId] as const;

export function useProjectEmployeesByCompany(
  projectId: string | undefined,
  companyId: string | undefined,
) {
  return useQuery({
    queryKey:
      projectId && companyId
        ? projectEmployeesByCompanyQueryKey(projectId, companyId)
        : ["project-employees-by-company", "", ""],
    queryFn: async () => {
      const res = await AllProjectsApi.getProjectEmployees(projectId!, {
        company_id: companyId!,
      });
      const body = res.data as typeof res.data & { status?: string };
      if (body.status === "error") {
        return [] as Employee[];
      }
      const payload = body.payload;
      if (!Array.isArray(payload)) {
        return [] as Employee[];
      }
      return payload.map(mapProjectEmployeeDto);
    },
    enabled: !!projectId && !!companyId,
  });
}
