import { apiClient } from "@/config/axios-config";

type ResponseT = {
  code: string;
  message: string;
  payload: {};
};

export default async function GetUserBankingData(userId: string) {
  const res = await apiClient.get<ResponseT>(`/bank_accounts/user/${userId}`);

  console.log("GetUserBankingData res:", res);
  return res.data.payload;
}
