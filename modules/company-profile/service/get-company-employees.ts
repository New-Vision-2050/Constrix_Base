import { apiClient } from "@/config/axios-config";

type ResponseT = {
  code: string;
  message: null | string;
  payload: { id: string; name: string }[];
};

export const getCompanyEmployees = async () => {
  try {
    const res = await apiClient.get<ResponseT>(`/company-users/employees`);
    return res.data.payload;
  } catch (error) {
    console.log(error);
    return [];
  }
};
