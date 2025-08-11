import { apiClient } from "@/config/axios-config";
import { Constraint } from "../types/constraint-type";

type ResponseT = {
  code: string;
  message: string;
  payload: Constraint[];
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
export default async function getConstraints({ limit, page }: Props) {
  const res = await apiClient.get<ResponseT>("/attendance/constraints", {
    params: {
      per_page: limit,
      page: page,
    },
  });

  return {payload:res.data.payload,pagination:res.data.pagination};
}
