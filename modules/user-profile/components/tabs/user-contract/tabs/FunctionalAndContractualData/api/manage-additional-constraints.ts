import { apiClient } from "@/config/axios-config";

export async function AssignAdditionalConstraints(
  userId: string,
  constraintIds: string[]
) {
  const res = await apiClient.post(
    `/attendance/constraints/users/${userId}/additional`,
    { constraint_ids: constraintIds }
  );
  return res.data;
}
