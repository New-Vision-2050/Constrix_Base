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
  options?: { search?: string },
) {
  const search = options?.search?.trim() || undefined;

  return useQuery({
    queryKey:
      projectId && companyId
        ? [...projectEmployeesByCompanyQueryKey(projectId, companyId), search ?? ""]
        : ["project-employees-by-company", "", ""],
    queryFn: async () => {
      const res = await AllProjectsApi.getProjectEmployees(projectId!, {
        company_id: companyId!,
        ...(search ? { search } : {}),
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
