import { useQuery } from "@tanstack/react-query";
import { ProjectOrderPermitsApi } from "@/services/api/projects/project-order-permits";
import type { WorkOrderRow } from "@/modules/projects/project/components/project-tabs/tabs/work-orders/types";
import { mapProjectOrderPermitDto } from "./mapProjectOrderPermit";

export const projectOrderPermitsQueryKey = (projectId: string) =>
  ["project-order-permits", projectId] as const;

export function useProjectOrderPermits(projectId: string | undefined) {
  return useQuery({
    queryKey: projectId
      ? projectOrderPermitsQueryKey(projectId)
      : ["project-order-permits", ""],
    queryFn: async () => {
      const res = await ProjectOrderPermitsApi.list(projectId!);
      const payload = res.data?.payload;
      if (!Array.isArray(payload)) {
        return [] as WorkOrderRow[];
      }
      return payload.map((item, index) =>
        mapProjectOrderPermitDto(item, index + 1),
      );
    },
    enabled: !!projectId,
    retry: false,
  });
}
