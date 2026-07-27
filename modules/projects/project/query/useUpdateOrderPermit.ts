import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectOrderPermitsApi } from "@/services/api/projects/project-order-permits";
import type { UpdateProjectOrderPermitArgs } from "@/services/api/projects/project-order-permits/types/params";
import { projectOrderPermitsQueryKey } from "./useProjectOrderPermits";

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
    onSuccess: () => {
      if (projectId) {
        queryClient.invalidateQueries({
          queryKey: projectOrderPermitsQueryKey(projectId),
        });
      }
    },
  });
}
