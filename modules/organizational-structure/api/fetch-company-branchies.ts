import { apiClient } from "@/config/axios-config";
import { SelectOption } from "@/types/select-option";

type ResponseT = {
  code: string;
  message: string;
  payload: SelectOption[];
};

export default async function fetchOrgBranchiesData() {
  const res = await apiClient.get<ResponseT>(
    `/management_hierarchies?type=branch`
  );

  return res.data.payload;
}
