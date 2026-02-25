import { apiClient } from "@/config/axios-config";
import { ClientRequestListParams } from "./types/params";
import { ClientRequestsListResponse } from "./types/response";

export const getClientRequests = async (
  params?: ClientRequestListParams,
): Promise<ClientRequestsListResponse> => {
  const response = await apiClient.get<ClientRequestsListResponse>(
    "/client-requests",
    { params },
  );
  return response.data;
};
