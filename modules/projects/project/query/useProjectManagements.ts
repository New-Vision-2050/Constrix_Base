import { useQuery } from "@tanstack/react-query";
import { ProjectManagementsApi } from "@/services/api/projects/project-managements";
import type { ProjectManagementDto } from "@/services/api/projects/project-managements/types/response";

export const projectManagementsQueryKey = (projectId?: string) =>
  projectId
    ? (["project-managements", projectId] as const)
    : (["project-managements"] as const);

export function useProjectManagements(projectId: string | undefined) {
  return useQuery({
    queryKey: projectManagementsQueryKey(projectId),
    queryFn: async () => {
      const res = await ProjectManagementsApi.list();
      const data = res.data?.payload;
      if (!Array.isArray(data)) {
        return [] as ProjectManagementDto[];
      }
      if (!projectId) return data;
      return data.filter(
        (item) => item.project_id === projectId,
      );
    },
    enabled: !!projectId,
    retry: false,
  });
}
