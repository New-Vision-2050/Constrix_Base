import { apiClient } from "@/config/axios-config";
import { mapContractBalance, type ContractBalance } from "./map-balance";

type BalanceResponse = {
  payload?: unknown;
  data?: unknown;
};

export default async function getContractBalance(
  url: string,
): Promise<ContractBalance> {
  const res = await apiClient.get<BalanceResponse>(url);
  const payload = res.data?.payload ?? res.data?.data ?? res.data;
  return mapContractBalance(payload);
}
