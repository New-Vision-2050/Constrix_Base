import { useQuery } from "@tanstack/react-query";
import { AllProjectsApi } from "@/services/api/projects/all-projects";
import type { ProjectEmployee } from "@/services/api/all-projects/types/response";
import type { Employee } from "@/modules/projects/project/components/project-tabs/tabs/staff/types";

function mapDtoToEmployee(item: ProjectEmployee): Employee {
  const u = item.user;
  const company = item.company;
  const pr = item.project_role;
  return {
    id: item.id,
    projectId: item.project_id,
    projectRole: pr
      ? {
          id: pr.id,
          name: pr.name,
          slug: pr.slug,
          is_default: pr.is_default,
        }
      : null,
    user: {
      id: u.id,
      name: u.name?.trim() ? u.name : "—",
      email: u.email?.trim() ?? "",
      phone: (u.phone ?? u.mobile ?? "").trim(),
    },
    company: company
      ? {
          id: String(company.id),
          name: company.name?.trim() ? company.name : "—",
        }
      : { id: "", name: "—" },
    assignedAt: item.assigned_at?.trim() ?? "",
    assignedBy: item.assigned_by ?? null,
    createdAt: item.created_at?.trim() ?? "",
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
