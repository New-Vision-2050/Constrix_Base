import { useQuery } from "@tanstack/react-query";
import { AllProjectsApi } from "@/services/api/projects/all-projects";
import type { Employee } from "@/modules/projects/project/components/project-tabs/tabs/staff/types";
import { mapProjectEmployeeDto } from "./mapProjectEmployee";

export const projectEmployeesQueryKey = (projectId: string) =>
  ["project-employees", projectId] as const;

export function useProjectEmployees(
  projectId: string | undefined,
  options?: { search?: string },
) {
  const search = options?.search?.trim() || undefined;

  return useQuery({
    queryKey: projectId
      ? [...projectEmployeesQueryKey(projectId), search ?? ""]
      : ["project-employees", ""],
    queryFn: async () => {
      const res = await AllProjectsApi.getProjectEmployees(projectId!, {
        ...(search ? { search } : {}),
      });
      const body = res.data as typeof res.data & {
        status?: string;
      };
      if (body.status === "error") {
        return [] as Employee[];
      }
      const payload = body.payload;
      if (!Array.isArray(payload)) {
        return [] as Employee[];
      }
      return payload.map(mapProjectEmployeeDto);
    },
    enabled: !!projectId,
  });
}
