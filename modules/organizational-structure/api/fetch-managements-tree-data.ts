import { organizationTreeData } from '@/modules/user-profile/types/organization-tree-response'
import { apiClient } from "@/config/axios-config";
import { OrgChartNode } from '@/types/organization'

type ResponseT = {
  code: string;
  message: string;
  payload: OrgChartNode[];
};

export default async function fetchManagementsTreeData(branchId: string|number) {
  const res = await apiClient.get<ResponseT>(`/management_hierarchies/tree`,{
    params: {
      id: branchId ?? "",
      type: 'management'
    },
  });

  return res.data.payload;
}
