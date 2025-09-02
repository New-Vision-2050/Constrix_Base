import { apiClient } from "@/config/axios-config";

export type WidgetT = {
  percentage: number;
  title: string;
  total: number;
};

type ResponseT = {
  code: string;
  message: string;
  payload: WidgetT[];
};

export default async function getBrokerWidgets() {
  const res = await apiClient.get<ResponseT>(`/company-users/brokers/widgets`);

  return res.data.payload;
}
