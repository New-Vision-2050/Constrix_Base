import { apiClient } from "@/config/axios-config";

export type CRMSettingsT = {
  is_share_client: "1" | "0";
  is_share_broker: "1" | "0";
};

type ResponseT = {
  code: string;
  message: string;
  payload: CRMSettingsT;
};

export default async function getSharedSettings() {
  const res = await apiClient.get<ResponseT>(`/settings/client-and-broker`);

  return res.data.payload;
}
