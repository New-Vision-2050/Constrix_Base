import { apiClient } from "@/config/axios-config";

export type City = {
  id: string;
  latitude: string;
  longitude: string;
  name: string;
};

type ResponseT = {
  code: string;
  message: string;
  payload: City[];
};

/**
 * Fetches constraints data (approvers) from the API
 * @returns Promise with constraints data (id, name)
 */
export default async function getCities() {
  const res = await apiClient.get<ResponseT>("/countries/cities");

  return res.data.payload;
}
