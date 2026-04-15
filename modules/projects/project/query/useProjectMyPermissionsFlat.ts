import { useQuery } from "@tanstack/react-query";
import { ProjectMyPermissionsApi } from "@/services/api/projects/project-my-permissions";
import type { ProjectMyPermissionFlatItem } from "@/services/api/projects/project-my-permissions/types/response";
import { toProjectMyPermissionsFlatList } from "@/modules/projects/project/utils/projectMyPermissions";

export const PROJECT_MY_PERMISSIONS_FLAT_QUERY_KEY =
  "project-my-permissions-flat" as const;

export function projectMyPermissionsFlatQueryKey(projectId: string | undefined) {
  return [PROJECT_MY_PERMISSIONS_FLAT_QUERY_KEY, projectId] as const;
}

/**
 * Returns the flat `permissions[]` list (normalized whether API sends an object or array).
 */
export function useProjectMyPermissionsFlat(projectId: string | undefined) {
  return useQuery({
    queryKey: projectMyPermissionsFlatQueryKey(projectId),
    queryFn: async (): Promise<ProjectMyPermissionFlatItem[]> => {
      const res = await ProjectMyPermissionsApi.flat(projectId!);
      return toProjectMyPermissionsFlatList(res.data.payload);
    },
    enabled: !!projectId,
  });
}
