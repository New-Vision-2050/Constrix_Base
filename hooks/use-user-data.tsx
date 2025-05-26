import { apiClient } from "@/config/axios-config";
import { CurrentUser } from "@/types/current-user";
import { ServerSuccessResponse } from "@/types/ServerResponse";
import { useQuery } from "@tanstack/react-query";

export default function useUserData() {
  return useQuery({
    queryKey: [`current-user-data`],
    queryFn: async () => {
      const response = await apiClient.get<ServerSuccessResponse<CurrentUser>>(
        "/users/me"
      );

      return response.data;
    },
    refetchOnWindowFocus: false, // don't refetch on tab switch
    // refetchOnReconnect: false,   // don't refetch on network reconnect
    // refetchOnMount: false,       // don't refetch when component remounts
  });
}
