import { apiClient } from "@/config/axios-config";
import { useQuery } from "@tanstack/react-query";

const fetchAllowedAttributes = async (id: string) => {
  const response = await apiClient.get(
    "/sub_entities/super_entities/attributes/config",
    {
      params: { super_entity_id: id },
    }
  );
  return response.data;
};

export const useAllowedAttributes = (id: string) => {
  return useQuery({
    queryKey: ["allowedAttributes-mainTable"],
    queryFn: () => fetchAllowedAttributes(id),
  });
};
