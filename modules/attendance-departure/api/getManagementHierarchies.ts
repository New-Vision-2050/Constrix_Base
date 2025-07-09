import { apiClient } from "@/config/axios-config";
import { SelectOption } from "@/types/select-option";
import { ManagementHierarchyItem } from "../hooks/useManagementHierarchies";

type ResponseT = {
  code: string;
  message: string;
  payload: ManagementHierarchyItem[];
};

/**
 * Fetches the list of management hierarchies (branches, departments)
 * @returns Promise with management hierarchies data in SelectOption format
 */
export default async function getManagementHierarchies() {
  const res = await apiClient.get<ResponseT>("/management_hierarchies/list");

  console.log("Management hierarchies response:", res.data);

  return res.data.payload;
}
