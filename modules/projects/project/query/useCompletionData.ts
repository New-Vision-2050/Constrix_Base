import { useQuery } from "@tanstack/react-query";
import { ProjectOrderPermitsApi } from "@/services/api/projects/project-order-permits";
import type { CompletionPhase, CompletionPhaseStatus } from "@/services/api/projects/project-order-permits/types/response";

export const completionDataQueryKey = (orderPermitId: number | string) =>
  ["completion-data", orderPermitId] as const;

export function useCompletionData(orderPermitId: number | null | undefined) {
  return useQuery({
    queryKey: orderPermitId
      ? completionDataQueryKey(orderPermitId)
      : ["completion-data", ""],
    queryFn: async () => {
      const res = await ProjectOrderPermitsApi.getCompletionData(orderPermitId!);
      return res.data;
    },
    enabled: !!orderPermitId,
    staleTime: 5 * 60 * 1000,
  });
}

export function flattenCompletionStatuses(
  data: ReturnType<typeof useCompletionData>["data"],
): CompletionPhaseStatus[] {
  if (!data?.data?.completion_phases) return [];
  const permitPhase = data.data.completion_phases.find(
    (phase) => phase.id === 1,
  );
  return permitPhase?.statuses ?? [];
}

export function getCompletionPhases(
  data: ReturnType<typeof useCompletionData>["data"],
): CompletionPhase[] {
  return data?.data?.completion_phases ?? [];
}

export function getAllCompletionStatuses(
  data: ReturnType<typeof useCompletionData>["data"],
): CompletionPhaseStatus[] {
  if (!data?.data?.completion_phases) return [];
  return data.data.completion_phases.flatMap((phase) => phase.statuses ?? []);
}
