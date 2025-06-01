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

  return res.data.payload?.map(makeIdsUnique);
}

const generateUniqueId = (baseId: string) =>
  `${baseId}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

const makeIdsUnique = (node: OrgChartNode): OrgChartNode => ({
  ...node,
  id: typeof node.id === 'string' ? generateUniqueId(node.id) : node.id,
  children: node.children?.map(makeIdsUnique),
  deputy_managers: node.deputy_managers?.map((dm: OrgChartNode) => ({
    ...dm,
    id: typeof dm.id === 'string' ? generateUniqueId(dm.id) : dm.id
  }))
});
