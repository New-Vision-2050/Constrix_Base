import { apiClient } from "@/config/axios-config";
import { CompanyData } from "@/modules/company-profile/types/company";
import { ServerSuccessResponse } from "@/types/ServerResponse";
import { useQuery } from "@tanstack/react-query";

export default function useCurrentAuthCompany() {
  return useQuery({
    queryKey: [`current-auth-company-data`],
    queryFn: async () => {
      const response = await apiClient.get<ServerSuccessResponse<CompanyData>>(
        "/companies/current-auth-company"
      );

      return response.data;
    },
    refetchOnWindowFocus: false, // don't refetch on tab switch
    // refetchOnReconnect: false,   // don't refetch on network reconnect
    // refetchOnMount: false,       // don't refetch when component remounts
  });
}
