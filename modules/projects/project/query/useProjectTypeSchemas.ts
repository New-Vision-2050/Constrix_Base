import { useQuery } from "@tanstack/react-query";
import { ProjectTypesApi } from "@/services/api/projects/project-types";
import type { PRJ_ProjectTypeSchema } from "@/types/api/projects/project-type-schema";

export const PROJECT_TYPE_SCHEMAS_QUERY_KEY = "project-type-schemas" as const;

export function projectTypeSchemasQueryKey(projectTypeId: string | number | undefined) {
  return [PROJECT_TYPE_SCHEMAS_QUERY_KEY, projectTypeId] as const;
}

export function useProjectTypeSchemas(
  projectTypeId: string | number | undefined,
) {
  return useQuery({
    queryKey: projectTypeSchemasQueryKey(projectTypeId),
    queryFn: async (): Promise<PRJ_ProjectTypeSchema[]> => {
      const res = await ProjectTypesApi.getProjectTypeSchemas(projectTypeId!);
      return res.data.payload ?? [];
    },
    enabled: !!projectTypeId,
    staleTime: 5 * 60 * 1000,
  });
}

export function hasMaintenanceSchema(
  schemas: PRJ_ProjectTypeSchema[] | undefined,
): boolean {
  return schemas?.some((s) => s.id === 12) ?? false;
}
