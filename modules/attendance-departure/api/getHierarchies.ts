import { apiClient } from "@/config/axios-config";

export interface ManagementHierarchyItem {
  id: string;
  name: string;
}

type ResponseT = {
  code: string;
  message: string;
  payload: ManagementHierarchyItem[];
};


export type HierarchyType = 'branch' | 'management';

/**
 * Retrieves the management hierarchy list (branches or departments)
 * @param type hierarchy type (branch for branches, management for departments)
 * @returns Promise containing the hierarchy data
 */
export default async function getHierarchies(type?: HierarchyType) {
  let url = "/management_hierarchies/list";
  
  if (type === 'management') {
    url += "?type=management";
  }

  const res = await apiClient.get<ResponseT>(url);
  return res.data.payload;
}
