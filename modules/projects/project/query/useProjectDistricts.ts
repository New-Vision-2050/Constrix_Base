import { useQuery } from "@tanstack/react-query";
import { ProjectDistrictsApi } from "@/services/api/projects/project-districts";
import type { ProjectDistrictDto } from "@/services/api/projects/project-districts/types/response";

export const projectDistrictsQueryKey = (projectId?: string) =>
  projectId
    ? (["project-districts", projectId] as const)
    : (["project-districts"] as const);

export function useProjectDistricts(projectId: string | undefined) {
  return useQuery({
    queryKey: projectDistrictsQueryKey(projectId),
    queryFn: async () => {
      const res = await ProjectDistrictsApi.list();
      const data = res.data?.payload;
      if (!Array.isArray(data)) {
        return [] as ProjectDistrictDto[];
      }
      if (!projectId) return data;
      return data.filter((item) => item.project_id === projectId);
    },
    enabled: !!projectId,
    retry: false,
  });
}
