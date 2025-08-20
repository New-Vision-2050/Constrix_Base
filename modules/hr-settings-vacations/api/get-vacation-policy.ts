import { apiClient } from "@/config/axios-config";
import { VacationPolicie } from "../types/VacationPolicie";

type ResponseT = {
  code: string;
  message: string;
  payload: VacationPolicie[];
  pagination: {
    last_page: number;
  };
};

type Props = {
  limit?: number;
  page?: number;
};

/**
 * Fetches constraints data (approvers) from the API
 * @returns Promise with constraints data (id, name)
 */
export default async function getVacationPolicies({ limit, page }: Props) {
  const res = await apiClient.get<ResponseT>("/leave-policies", {
    params: {
      per_page: limit,
      page: page,
    },
  });

  return { payload: res.data.payload, pagination: res.data.pagination };
}
