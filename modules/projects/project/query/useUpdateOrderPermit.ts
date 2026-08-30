import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectOrderPermitsApi } from "@/services/api/projects/project-order-permits";
import type { UpdateProjectOrderPermitArgs } from "@/services/api/projects/project-order-permits/types/params";
import { isNoteFieldBody } from "@/modules/projects/project/components/project-tabs/tabs/work-orders/noteColumns";
import { projectOrderPermitsQueryKey } from "./useProjectOrderPermits";

function invalidateProjectOrderPermits(
  queryClient: ReturnType<typeof useQueryClient>,
  projectId: string,
) {
  queryClient.invalidateQueries({
    predicate: (query) =>
      Array.isArray(query.queryKey) &&
      query.queryKey[0] === projectOrderPermitsQueryKey(projectId)[0] &&
      query.queryKey[1] === projectId,
  });
}

function invalidateNoteLogs(
  queryClient: ReturnType<typeof useQueryClient>,
  projectId: string,
  orderPermitId: string | number,
) {
  queryClient.invalidateQueries({
    predicate: (query) =>
      Array.isArray(query.queryKey) &&
      query.queryKey[0] === "note-logs" &&
      query.queryKey[1] === projectId &&
      String(query.queryKey[2]) === String(orderPermitId),
  });
}

export function useUpdateOrderPermit(projectId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      body,
    }: {
      id: string | number;
      body: UpdateProjectOrderPermitArgs;
    }) => {
      if (!projectId) throw new Error("Missing project ID");
      return ProjectOrderPermitsApi.update(projectId, id, body);
    },
    onSuccess: (_data, variables) => {
      if (!projectId) return;

      invalidateProjectOrderPermits(queryClient, projectId);

      if (isNoteFieldBody(variables.body)) {
        invalidateNoteLogs(queryClient, projectId, variables.id);
      }
    },
  });
}
