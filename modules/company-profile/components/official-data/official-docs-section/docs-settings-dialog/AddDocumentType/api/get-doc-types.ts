import { apiClient } from "@/config/axios-config";

export type DocType = {
  company_id: string;
  id: string;
  is_active: number;
  name: string;
};

export type ResponseT = {
  code: string;
  message: string;
  payload: DocType[];
};

export default async function getDocTypes() {
  const res = await apiClient.get<ResponseT>(`/document_types`);

  return res.data.payload;
}
