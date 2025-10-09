import { apiClient } from "@/config/axios-config";
import { SelectOption } from "@/types/select-option";

// API response type
type ResponseT = {
  code: string;
  message: string;
  payload: SelectOption[];
};

export default async function getFoldersList() {
  const res = await apiClient.get<ResponseT>(`/folders/get-all-folders`);

  return res.data.payload;
}
