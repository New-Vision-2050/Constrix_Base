import { apiClient } from "@/config/axios-config";
import { SelectOption } from "@/types/select-option";

type ResponseT = {
  code: string;
  message: string;
  payload: SelectOption[];
};

export default async function getConstraint(constraint_id: string) {
  const res = await apiClient.get<ResponseT>(
    `/attendance/constraints/${constraint_id}`
  );

  return res.data.payload;
}
