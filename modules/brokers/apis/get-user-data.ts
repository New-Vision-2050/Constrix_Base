import { apiClient } from "@/config/axios-config";

type ResponseT = {
  code: string;
  message: string;
  payload: any[];
};


export default async function getUserDataById(id: string) {
  const res = await apiClient.get<ResponseT>(`/users/${id}`);

  return res.data.payload;
}
