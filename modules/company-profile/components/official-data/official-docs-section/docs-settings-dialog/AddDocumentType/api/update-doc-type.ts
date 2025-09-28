import { apiClient, baseURL } from "@/config/axios-config";

export type UpdateDocTypeRequest = {
  id: string;
  name: string;
};

export type UpdateDocTypeResponse = {
  code: string;
  message: string;
  payload: {
    id: string;
    name: string;
    company_id: string;
    is_active: number;
  };
};

export default async function updateDocType(data: UpdateDocTypeRequest) {
  const res = await apiClient.put<UpdateDocTypeResponse>(
    baseURL + `/document_types/${data.id}`, 
    { name: data.name }
  );
  return res.data;
}
