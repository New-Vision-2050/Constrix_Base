import { apiClient } from "@/config/axios-config";
import { BankAccount } from "@/modules/user-profile/types/bank-account";

type ResponseT = {
  code: string;
  message: string;
  payload: BankAccount[];
};

export default async function GetUserBankingData(userId: string) {
  const res = await apiClient.get<ResponseT>(`/bank_accounts/user/${userId}`);

  return res.data.payload;
}
