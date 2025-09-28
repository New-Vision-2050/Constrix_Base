import { useMutation, useQueryClient } from "@tanstack/react-query";
import deleteDocType from "./api/delete-doc-type";

export const useDeleteDocType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDocType,
    onSuccess: () => {
      // Invalidate and refetch doc types after successful deletion
      queryClient.invalidateQueries({ queryKey: ["doc-types"] });
    },
  });
};
