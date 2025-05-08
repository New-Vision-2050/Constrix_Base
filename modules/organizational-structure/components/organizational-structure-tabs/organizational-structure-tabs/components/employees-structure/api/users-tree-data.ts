import { apiClient } from "@/config/axios-config";
import { UserHierarchies } from "../types/UserHierarchies";

export type UsersHierarchiesResponse = {
  users: UserHierarchies[];
  children: UsersHierarchiesResponse[];
};
type ResponseT = {
  code: string;
  message: string;
  payload: UsersHierarchiesResponse[];
};

export default async function GetUsersHierarchiesData() {
  const res = await apiClient.get<ResponseT>(
    `/management_hierarchies/tree-direct-children`
  );

  return res.data.payload;
}
