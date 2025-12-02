import { apiClient } from "@/config/axios-config";
import { Salary } from "@/modules/user-profile/types/Salary";

type ResponseT = {
  code: string;
  message: string;
  payload: Salary;
};

export default async function GetUserSalaryData(userId: string) {
  const res = await apiClient.get<ResponseT>(`/user_salaries/user${Boolean(userId) ? '/' + userId : ''}`);

  return res.data.payload;
}
