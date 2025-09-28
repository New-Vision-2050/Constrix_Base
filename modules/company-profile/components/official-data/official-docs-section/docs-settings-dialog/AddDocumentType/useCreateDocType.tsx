import { useMutation, useQueryClient } from "@tanstack/react-query";
import createDocType, { CreateDocTypeRequest } from "./api/create-doc-type";
import updateDocType, { UpdateDocTypeRequest } from "./api/update-doc-type";

type MutationData = CreateDocTypeRequest | UpdateDocTypeRequest;

export const useCreateDocType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MutationData) => {
      // Check if it's an update operation (has id)
      if ('id' in data) {
        return updateDocType(data as UpdateDocTypeRequest);
      }
      // Otherwise it's a create operation
      return createDocType(data as CreateDocTypeRequest);
    },
    onSuccess: () => {
      // Invalidate and refetch doc types after successful create/update
      queryClient.invalidateQueries({ queryKey: ["doc-types"] });
    },
  });
};
