import { apiClient } from "@/config/axios-config";
import { OrgChartNode } from '@/types/organization'

type ResponseT = {
  code: string;
  message: string;
  payload: OrgChartNode[];
};

export default async function fetchEmployeesTreeData(branchId: string|number) {
  const res = await apiClient.get<ResponseT>(`/management_hierarchies/tree-direct-children`,{
    params: {
      id: branchId ?? "",
    },
  });

  return res.data.payload;
}
