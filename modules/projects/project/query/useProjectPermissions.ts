import { useQuery } from "@tanstack/react-query";
import { ProjectPermissionsApi } from "@/services/api/projects/permissions";

export const PROJECT_PERMISSIONS_QUERY_KEY = "project-permissions" as const;

export interface UseProjectPermissionsParams {
  projectId: string | undefined;
}

export const projectPermissionsQueryKey = (
  params: UseProjectPermissionsParams
) => [PROJECT_PERMISSIONS_QUERY_KEY, params] as const;

export function useProjectPermissions(params: UseProjectPermissionsParams) {
  const { projectId } = params;

  return useQuery({
    queryKey: projectPermissionsQueryKey(params),
    queryFn: async () => {
      const res = await ProjectPermissionsApi.getMyPermissions(projectId!);
      return res.data.data;
    },
    enabled: !!projectId,
  });
}
