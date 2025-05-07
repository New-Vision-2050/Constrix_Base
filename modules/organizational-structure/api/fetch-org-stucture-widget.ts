import { apiClient } from "@/config/axios-config";

export type OrgWidgetsResponse = {
  users: {
    total_users: number;
    users_with_hierarchy: number;
    users_without_hierarchy: number;
  };
  branches: {
    total_count: number;
    used_count: number;
    unused_count: number;
  };
  management: {
    total_count: number;
    used_count: number;
    unused_count: number;
  };
  departments: {
    total_count: number;
    used_count: number;
    unused_count: number;
  };
};

type ResponseT = {
  code: string;
  message: string;
  payload: OrgWidgetsResponse;
};

export default async function fetchOrgWidgetsData() {
  const res = await apiClient.get<ResponseT>(`/management_hierarchies/widgets`);

  return res.data.payload;
}
