import { apiClient, baseURL } from "@/config/axios-config";

export type DeleteDocTypeResponse = {
  code: string;
  message: string;
};

export default async function deleteDocType(id: string) {
  const res = await apiClient.delete<DeleteDocTypeResponse>(
    baseURL + `/document_types/${id}`
  );
  return res.data;
}
