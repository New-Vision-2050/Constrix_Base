import { useQuery } from "@tanstack/react-query";
import { getMapLiveTracking } from "@/modules/attendance-departure/api/map-live-tracking";
import type { MapEmployee } from "@/modules/attendance-departure/components/map/types";

type UseProjectMapTrackingDataProps = {
  projectId?: string;
  companyId?: string;
  enabled?: boolean;
};

export function useProjectMapTrackingData({
  projectId,
  companyId,
  enabled = true,
}: UseProjectMapTrackingDataProps) {
  return useQuery<MapEmployee[]>({
    queryKey: ["project-map-tracking", projectId, companyId ?? ""],
    queryFn: () =>
      getMapLiveTracking({
        project_id: projectId,
        company_id: companyId,
      }),
    enabled: enabled && Boolean(projectId),
    refetchOnWindowFocus: false,
  });
}
