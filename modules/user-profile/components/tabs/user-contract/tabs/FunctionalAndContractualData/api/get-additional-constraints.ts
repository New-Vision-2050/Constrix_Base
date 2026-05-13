import { apiClient } from "@/config/axios-config";

export type AdditionalConstraint = {
  id: string;
  constraint_name: string;
  constraint_type: string;
  is_active: boolean;
};

type ResponseT = {
  code: string;
  message: string;
  payload: AdditionalConstraint[];
};

export default async function GetAdditionalConstraints(userId: string) {
  const res = await apiClient.get<ResponseT>(
    `/attendance/constraints/users/${userId}/additional`
  );
  return res.data.payload ?? [];
}
