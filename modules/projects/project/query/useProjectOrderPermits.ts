import { useQuery } from "@tanstack/react-query";
import { ProjectOrderPermitsApi } from "@/services/api/projects/project-order-permits";
import type { WorkOrderRow } from "@/modules/projects/project/components/project-tabs/tabs/work-orders/types";
import { mapProjectOrderPermitDto } from "./mapProjectOrderPermit";

export const projectOrderPermitsQueryKey = () =>
  ["project-order-permits"] as const;

export function useProjectOrderPermits(projectId: string | undefined) {
  return useQuery({
    queryKey: projectId
      ? projectOrderPermitsQueryKey()
      : ["project-order-permits"],
    queryFn: async () => {
      const res = await ProjectOrderPermitsApi.list();
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
