import { useQuery } from "@tanstack/react-query";
import { ProjectSharingDepartmentApi } from "@/services/api/projects/project-sharing-department";
import type { ProjectSharingDepartmentPayload } from "@/services/api/projects/project-sharing-department/types/response";
import { ProjectSharingWorkOrdersApi } from "@/services/api/projects/project-sharing-work-orders";
import type { ProjectSharingWorkOrderPayload } from "@/services/api/projects/project-sharing-work-orders/types/response";

export const orderPermitsQueryKey = (projectTypeId: number | string) =>
  ["order-permits", projectTypeId] as const;

export const orderPermitDepartmentsQueryKey = (projectTypeId: number | string) =>
  ["order-permit-departments", projectTypeId] as const;

export function getOrderPermitLabel(item: ProjectSharingWorkOrderPayload): string {
  return item.type?.trim() || item.description?.trim() || item.code;
}

export function getOrderPermitDepartmentLabel(
  item: ProjectSharingDepartmentPayload,
): string {
  return item.description?.trim() || item.code;
}

export function useOrderPermits(projectTypeId: number | undefined) {
  return useQuery({
    queryKey: projectTypeId
      ? orderPermitsQueryKey(projectTypeId)
      : ["order-permits", ""],
    queryFn: async () => {
      const res = await ProjectSharingWorkOrdersApi.list(projectTypeId!);
      return res.data.payload ?? [];
    },
    enabled: !!projectTypeId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useOrderPermitDepartments(projectTypeId: number | undefined) {
  return useQuery({
    queryKey: projectTypeId
      ? orderPermitDepartmentsQueryKey(projectTypeId)
      : ["order-permit-departments", ""],
    queryFn: async () => {
      const res = await ProjectSharingDepartmentApi.list(projectTypeId!);
      return res.data.payload ?? [];
    },
    enabled: !!projectTypeId,
    staleTime: 5 * 60 * 1000,
  });
}
