import { useQuery } from "@tanstack/react-query";
import { ProjectOrderPermitsApi } from "@/services/api/projects/project-order-permits";
import type { WorkOrderRow } from "@/modules/projects/project/components/project-tabs/tabs/work-orders/types";
import { mapProjectOrderPermitDto } from "./mapProjectOrderPermit";

export const projectOrderPermitsQueryKey = (
  projectId?: string,
  departmentId?: number,
) => {
  if (projectId && departmentId != null) {
    return ["project-order-permits", projectId, departmentId] as const;
  }
  if (projectId) {
    return ["project-order-permits", projectId] as const;
  }
  return ["project-order-permits"] as const;
};

export function useProjectOrderPermits(
  projectId: string | undefined,
  departmentId?: number,
) {
  return useQuery({
    queryKey: projectOrderPermitsQueryKey(projectId, departmentId),
    queryFn: async () => {
      const res = await ProjectOrderPermitsApi.listForProject(
        projectId!,
        departmentId != null
          ? { order_permit_department_id: departmentId }
          : undefined,
      );
      const payload = res.data?.payload;
      if (!Array.isArray(payload)) {
        return [] as WorkOrderRow[];
      }
      return payload.map((item) => mapProjectOrderPermitDto(item));
    },
    enabled: !!projectId,
    retry: false,
  });
}
