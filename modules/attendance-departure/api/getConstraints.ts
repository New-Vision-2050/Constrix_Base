import { apiClient } from "@/config/axios-config";

export interface Constraint {
  id: string;
  constraint_name: string;
}

type ConstraintList = Constraint[];

type ResponseT = {
  code: string;
  message: string;
  payload: ConstraintList[];
};

/**
 * Fetches constraints data (approvers) from the API
 * @returns Promise with constraints data (id, name)
 */
export default async function getConstraints() {
  const res = await apiClient.get<ResponseT>("/attendance/constraints");

  return res.data.payload?.[0];
}
