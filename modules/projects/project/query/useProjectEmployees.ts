import { useQuery } from "@tanstack/react-query";
import { AllProjectsApi } from "@/services/api/projects/all-projects";
import type { ProjectEmployee } from "@/services/api/all-projects/types/response";
import type { Employee } from "@/modules/projects/project/components/project-tabs/tabs/staff/types";

function mapDtoToEmployee(item: ProjectEmployee): Employee {
  const u = item.user;
  const branch = u?.branch;
  return {
    id: String(u?.id ?? item.id),
    name: u?.name ?? "—",
    phone: u?.phone ?? u?.mobile ?? "",
    email: u?.email ?? "",
    branch: {
      id: branch?.id ?? 0,
      name: branch?.name ?? "—",
    },
    jobTitle: u?.job_title ?? u?.jobTitle ?? "",
    department: u?.department ?? u?.department_name ?? "",
  };
}

export const projectEmployeesQueryKey = (projectId: string) =>
  ["project-employees", projectId] as const;

export function useProjectEmployees(projectId: string | undefined) {
  return useQuery({
    queryKey: projectId ? projectEmployeesQueryKey(projectId) : ["project-employees", ""],
    queryFn: async () => {
      const res = await AllProjectsApi.getProjectEmployees(projectId!);
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
      return payload.map(mapDtoToEmployee);
    },
    enabled: !!projectId,
  });
}
