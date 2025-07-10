import { apiClient } from "@/config/axios-config";
import { Constraint } from "../types/constraint-type";

type ResponseT = {
  code: string;
  message: string;
  payload: Constraint[];
};

/**
 * Fetches constraints data (approvers) from the API
 * @returns Promise with constraints data (id, name)
 */
export default async function getConstraints() {
  const res = await apiClient.get<ResponseT>("/attendance/constraints");

  return res.data.payload;
}
