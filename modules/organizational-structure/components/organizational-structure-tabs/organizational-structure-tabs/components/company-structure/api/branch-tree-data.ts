import { apiClient } from "@/config/axios-config";
import { HierarchiesBranch } from "../types/HierarchiesBranch";

type ResponseT = {
  code: string;
  message: string;
  payload: HierarchiesBranch[];
};

export default async function GetBranchHierarchiesData(type?: string) {
  const res = await apiClient.get<ResponseT>(
    `/management_hierarchies/tree${type ? `?type=${type}` : ""}`
  );

  return res.data.payload;
}
