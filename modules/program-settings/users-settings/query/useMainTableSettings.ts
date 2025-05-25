import { apiClient } from "@/config/axios-config";
import { useQuery } from "@tanstack/react-query";

const fetchAllowedSettings = async (id: string) => {
  const response = await apiClient.get(
    "/sub_entities/super_entities/registration/config",
    {
      params: { super_entity_id: id },
    }
  );
  return response.data;
};

export const useMainTableSettings = (id: string) => {
  return useQuery({
    queryKey: ["allowedSettings-mainTable"],
    queryFn: () => fetchAllowedSettings(id),
  });
};
