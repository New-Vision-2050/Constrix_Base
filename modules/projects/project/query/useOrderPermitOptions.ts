import { useQuery } from "@tanstack/react-query";
import { ProjectOrderPermitsApi } from "@/services/api/projects/project-order-permits";
import type {
  ProjectOrderPermitDepartmentDto,
  ProjectOrderPermitTypeDto,
} from "@/services/api/projects/project-order-permits/types/response";

export const orderPermitsQueryKey = () => ["order-permits", "options"] as const;

export const orderPermitDepartmentsQueryKey = (orderPermitId: number | string) =>
  ["order-permit-departments", orderPermitId] as const;

export function getOrderPermitLabel(item: ProjectOrderPermitTypeDto): string {
  return item.code?.trim() || item.description?.trim() || item.type;
}

export function getOrderPermitDepartmentLabel(
  item: ProjectOrderPermitDepartmentDto,
): string {
  return item.description?.trim() || item.code;
}

export function useOrderPermits(enabled = false) {
  return useQuery({
    queryKey: orderPermitsQueryKey(),
    queryFn: async () => {
      const res = await ProjectOrderPermitsApi.list();
      return (res.data.payload ?? []) as ProjectOrderPermitTypeDto[];
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useOrderPermitDepartments(orderPermitId: number | undefined) {
  return useQuery({
    queryKey: orderPermitId
      ? orderPermitDepartmentsQueryKey(orderPermitId)
      : ["order-permit-departments", ""],
    queryFn: async () => {
      const res = await ProjectOrderPermitsApi.listDepartments(orderPermitId!);
      return res.data.payload ?? [];
    },
    enabled: !!orderPermitId,
    staleTime: 5 * 60 * 1000,
  });
}
