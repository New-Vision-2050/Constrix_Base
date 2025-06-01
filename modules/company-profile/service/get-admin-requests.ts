import { apiClient } from "@/config/axios-config";
import { AdminRequestType, AdminRequestResponse } from "@/types/admin-request";

type AdminRequestParams = {
  type: AdminRequestType;
  company_id: string;
  branch_id?: string;
};

export const getAdminRequests = async (params: AdminRequestParams) => {
  const res = await apiClient.get<AdminRequestResponse>(`/admin_requests`, {
    params,
  });

  return res.data.payload;
};
