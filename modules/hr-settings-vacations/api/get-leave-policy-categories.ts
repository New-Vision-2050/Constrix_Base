import { apiClient } from "@/config/axios-config";
import { LeavePolicyCategory } from "../types/LeavePolicyCategory";

type ResponseT = {
  code: string;
  message: string;
  payload: LeavePolicyCategory[];
};

export default async function getLeavePolicyCategories() {
  const res = await apiClient.get<ResponseT>("/leave-policy-categories", {
    params: { per_page: 100 },
  });
  return res.data.payload ?? [];
}
