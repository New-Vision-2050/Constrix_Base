import { useQuery } from "@tanstack/react-query";
import { ProjectRolesApi } from "@/services/api/projects/project-roles";

export const PROJECT_ROLES_QUERY_KEY = "project-roles" as const;

export function projectRolesQueryKey(projectId: string | undefined) {
  return [PROJECT_ROLES_QUERY_KEY, projectId] as const;
}

export function useProjectRoles(
  projectId: string | undefined,
  options?: { search?: string },
) {
  const search = options?.search?.trim() || undefined;

  return useQuery({
    queryKey: [...projectRolesQueryKey(projectId), search ?? ""],
    queryFn: async () => {
      const res = await ProjectRolesApi.list(projectId!, {
        ...(search ? { search } : {}),
      });
      return res.data.payload;
    },
    enabled: !!projectId,
  });
}
