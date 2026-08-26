import { useQuery } from "@tanstack/react-query";
import { ProjectOrderPermitsApi } from "@/services/api/projects/project-order-permits";
import {
  matchesNoteLogType,
  normalizeNoteLogTypes,
} from "@/modules/projects/project/components/project-tabs/tabs/work-orders/noteLogTypes";

export const noteLogsQueryKey = (
  projectId: string | number,
  orderPermitId: string | number,
  noteTypes?: string | readonly string[],
) =>
  [
    "note-logs",
    projectId,
    orderPermitId,
    normalizeNoteLogTypes(noteTypes)?.join("|") ?? "all",
  ] as const;

export function useNoteLogs(
  projectId: string | undefined,
  orderPermitId: string | number | null | undefined,
  noteTypes?: string | readonly string[],
) {
  const normalizedNoteTypes = normalizeNoteLogTypes(noteTypes);

  return useQuery({
    queryKey:
      projectId && orderPermitId
        ? noteLogsQueryKey(projectId, orderPermitId, normalizedNoteTypes)
        : ["note-logs", "", "", "all"],
    queryFn: async () => {
      const res = await ProjectOrderPermitsApi.getNoteLogs(
        projectId!,
        orderPermitId!,
      );
      const all = res.data?.payload ?? res.data?.data ?? [];
      if (!normalizedNoteTypes?.length) return all;
      return all.filter((log) =>
        matchesNoteLogType(log.type, normalizedNoteTypes),
      );
    },
    enabled: !!projectId && !!orderPermitId,
    staleTime: 5 * 60 * 1000,
  });
}
