import { apiClient } from "@/config/axios-config";

export type BankType = {
  id: string;
  name: string;
  code: string;
};
type ResponseT = {
  code: string;
  message: string;
  payload: BankType[];
};

export default async function GetBankAccountTypes() {
  const res = await apiClient.get<ResponseT>(`/bank_type_accounts`);

  return res.data.payload;
}
