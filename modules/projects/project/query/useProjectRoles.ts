import { useQuery } from "@tanstack/react-query";
import { ProjectRolesApi } from "@/services/api/projects/project-roles";

export const PROJECT_ROLES_QUERY_KEY = "project-roles" as const;

export function projectRolesQueryKey(projectId: string | undefined) {
  return [PROJECT_ROLES_QUERY_KEY, projectId] as const;
}

export function useProjectRoles(projectId: string | undefined) {
  return useQuery({
    queryKey: projectRolesQueryKey(projectId),
    queryFn: async () => {
      const res = await ProjectRolesApi.list(projectId!);
      return res.data.payload;
    },
    enabled: !!projectId,
  });
}
