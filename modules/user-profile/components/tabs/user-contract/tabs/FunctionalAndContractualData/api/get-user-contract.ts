import { apiClient } from "@/config/axios-config";
import { Contract } from "@/modules/user-profile/types/Contract";

type ResponseT = {
  code: string;
  message: string;
  payload: Contract;
};

export default async function GetUserContractData(userId: string) {
  const res = await apiClient.get<ResponseT>(
    `/employment_contracts/user${Boolean(userId) ? "/" + userId : ""}`
  );

  return res.data.payload;
}
