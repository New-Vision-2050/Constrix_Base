import { apiClient } from "@/config/axios-config";
import { Branch } from "@/modules/user-profile/types/branch";

type ResponseT = {
  code: string;
  message: string;
  payload: Branch[];
};

/**
 * Fetches constraints data (approvers) from the API
 * @returns Promise with constraints data (id, name)
 */
export default async function getBranches() {
  const res = await apiClient.get<ResponseT>("/management_hierarchies/list");

  return res.data.payload;
}
