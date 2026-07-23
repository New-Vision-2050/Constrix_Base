import { useQuery } from "@tanstack/react-query";
import { ProjectSharingDepartmentApi } from "@/services/api/projects/project-sharing-department";
import type { ProjectSharingDepartmentPayload } from "@/services/api/projects/project-sharing-department/types/response";

export const projectOrderPermitDepartmentsListQueryKey = () =>
  ["project-order-permit-departments"] as const;

export function getProjectOrderPermitDepartmentLabel(
  department: ProjectSharingDepartmentPayload,
): string {
  return (
    department.name?.trim() ||
    department.description?.trim() ||
    department.code?.trim() ||
    String(department.id)
  );
}

export function useProjectOrderPermitDepartmentsList(enabled = true) {
  return useQuery({
    queryKey: projectOrderPermitDepartmentsListQueryKey(),
    queryFn: async () => {
      const res = await ProjectSharingDepartmentApi.list();
      return res.data.payload ?? [];
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
