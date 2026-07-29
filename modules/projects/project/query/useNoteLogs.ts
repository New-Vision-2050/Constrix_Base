import { useQuery } from "@tanstack/react-query";
import { ProjectOrderPermitsApi } from "@/services/api/projects/project-order-permits";

export const noteLogsQueryKey = (
  projectId: string | number,
  orderPermitId: string | number,
  noteType?: string,
) => ["note-logs", projectId, orderPermitId, noteType ?? "all"] as const;

export function useNoteLogs(
  projectId: string | undefined,
  orderPermitId: string | number | null | undefined,
  noteType?: string,
) {
  return useQuery({
    queryKey:
      projectId && orderPermitId
        ? noteLogsQueryKey(projectId, orderPermitId, noteType)
        : ["note-logs", "", "", "all"],
    queryFn: async () => {
      const res = await ProjectOrderPermitsApi.getNoteLogs(
        projectId!,
        orderPermitId!,
      );
      const all = res.data?.data ?? [];
      if (!noteType) return all;
      return all.filter((log) => log.type === noteType);
    },
    enabled: !!projectId && !!orderPermitId,
    staleTime: 5 * 60 * 1000,
  });
}
