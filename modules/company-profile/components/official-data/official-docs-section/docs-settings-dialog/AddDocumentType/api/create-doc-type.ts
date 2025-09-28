import { apiClient, baseURL } from "@/config/axios-config";

export type CreateDocTypeRequest = {
  name: string;
};

export type CreateDocTypeResponse = {
  code: string;
  message: string;
  payload: {
    id: string;
    name: string;
    company_id: string;
    is_active: number;
  };
};

export default async function createDocType(data: CreateDocTypeRequest) {
  const res = await apiClient.post<CreateDocTypeResponse>(baseURL + "/document_types", data);
  return res.data;
}
