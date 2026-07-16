import { useQuery } from "@tanstack/react-query";
import { ProjectOrderPermitsApi } from "@/services/api/projects/project-order-permits";
import type { WorkOrderRow } from "@/modules/projects/project/components/project-tabs/tabs/work-orders/types";
import { mapProjectOrderPermitDto } from "./mapProjectOrderPermit";

export const projectOrderPermitsQueryKey = (projectId?: string) =>
  projectId
    ? (["project-order-permits", projectId] as const)
    : (["project-order-permits"] as const);

export function useProjectOrderPermits(projectId: string | undefined) {
  return useQuery({
    queryKey: projectOrderPermitsQueryKey(projectId),
    queryFn: async () => {
      const res = await ProjectOrderPermitsApi.listForProject(projectId!);
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
