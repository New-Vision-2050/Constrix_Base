import { useQuery } from "@tanstack/react-query";
import { ProjectViolationsApi } from "@/services/api/projects/violations";
import { extractProjectViolationCatalog } from "@/services/api/projects/violations/types/response";

export const PROJECT_VIOLATIONS_CATALOG_QUERY_KEY =
  "project-violations-catalog" as const;

export function useProjectViolationsCatalog(enabled = true) {
  return useQuery({
    queryKey: [PROJECT_VIOLATIONS_CATALOG_QUERY_KEY],
    queryFn: async () => {
      const res = await ProjectViolationsApi.listCatalog();
      return extractProjectViolationCatalog(res.data);
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
