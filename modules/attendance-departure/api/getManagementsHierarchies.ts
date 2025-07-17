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
export default async function getManagementsHierarchies() {
  const res = await apiClient.get<ResponseT>("/management_hierarchies/list?type=management");

  return res.data.payload;
}
