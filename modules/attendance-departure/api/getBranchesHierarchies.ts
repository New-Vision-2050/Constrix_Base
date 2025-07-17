import { apiClient } from "@/config/axios-config";
import { ManagementHierarchyItem } from "../hooks/useBranchesHierarchies";

type ResponseT = {
  code: string;
  message: string;
  payload: ManagementHierarchyItem[];
};

/**
 * Fetches the list of management hierarchies (branches, departments)
 * @returns Promise with management hierarchies data in SelectOption format
 */
export default async function getBranchesHierarchies() {
  const res = await apiClient.get<ResponseT>("/management_hierarchies/list");

  return res.data.payload;
}
