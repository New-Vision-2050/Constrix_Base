import { apiClient } from "@/config/axios-config";
import { VacationType } from "../types/VacationType";

type ResponseT = {
  code: string;
  message: string;
  payload: VacationType[];
};

export default async function getLeaveTypes() {
  const res = await apiClient.get<ResponseT>("/leave-types", {
    params: { per_page: 100 },
  });
  return res.data.payload ?? [];
}
