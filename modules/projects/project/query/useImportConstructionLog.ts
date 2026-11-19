import { useQuery } from "@tanstack/react-query";
import { ProjectOrderPermitsApi } from "@/services/api/projects/project-order-permits";
import type { ImportConstructionLogDto } from "@/services/api/projects/project-order-permits/types/response";

const TERMINAL_STATUSES = new Set([
  "completed",
  "completed_with_errors",
  "failed",
  "cancelled",
]);

export const importConstructionLogQueryKey = (
  projectId: string | number,
  importId: string,
) => ["import-construction-log", projectId, importId] as const;

function unwrapImportConstructionLog(body: unknown): ImportConstructionLogDto | null {
  if (!body || typeof body !== "object") return null;
  const record = body as {
    payload?: ImportConstructionLogDto | null;
    data?: ImportConstructionLogDto | null;
  };
  return record.payload ?? record.data ?? null;
}

export function isImportConstructionLogTerminal(status?: string | null): boolean {
  if (!status) return false;
  return TERMINAL_STATUSES.has(status.toLowerCase());
}

export function useImportConstructionLog(
  projectId: string | undefined,
  importId: string | null | undefined,
  enabled = true,
) {
  return useQuery({
    queryKey:
      projectId && importId
        ? importConstructionLogQueryKey(projectId, importId)
        : ["import-construction-log", "", ""],
    queryFn: async () => {
      const res = await ProjectOrderPermitsApi.getImportConstructionLog(
        projectId!,
        importId!,
      );
      return unwrapImportConstructionLog(res.data);
    },
    enabled: Boolean(enabled && projectId && importId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (!status || isImportConstructionLogTerminal(status)) return false;
      return 3000;
    },
  });
}
