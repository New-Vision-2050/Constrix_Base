import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ServerSuccessResponse } from "@/types/ServerResponse";
import { CompanyDocument } from "../../types/company";
import { apiClient } from "@/config/axios-config";

export const useOfficialDocsData = (id?: string, currentCompanyId?: string) => {
  return useQuery({
    queryKey: ["company-official-documents", id, currentCompanyId],
    queryFn: async () => {
      const response = await apiClient.get<
        ServerSuccessResponse<CompanyDocument[]>
      >("/companies/company-profile/company-official-documents", {
        params: {
          ...(id && { branch_id: id }),
          ...(currentCompanyId && { company_id: currentCompanyId }),
        },
      });

      return response.data;
    },
  });
};
