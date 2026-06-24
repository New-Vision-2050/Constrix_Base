import { useQuery } from "@tanstack/react-query";
import { getMapLiveTracking } from "@/modules/attendance-departure/api/map-live-tracking";
import type { MapEmployee } from "@/modules/attendance-departure/components/map/types";

type UseConstraintMapTrackingDataProps = {
  constraintId: string;
  enabled?: boolean;
};

export function useConstraintMapTrackingData({
  constraintId,
  enabled = true,
}: UseConstraintMapTrackingDataProps) {
  return useQuery<MapEmployee[]>({
    queryKey: ["constraint-map-tracking", constraintId],
    queryFn: () =>
      getMapLiveTracking({
        approver: constraintId,
      }),
    enabled: enabled && Boolean(constraintId),
    refetchOnWindowFocus: false,
  });
}
