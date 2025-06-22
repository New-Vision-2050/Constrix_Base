import { apiClient } from "@/config/axios-config";

interface LoginAdminResponse {
  code: string;
  message: string | null;
  payload: {
    token: string;
  };
}

export default async function fetchLoginAdmin(token: string) {
  const url = `/auths/login-as-admin`;
  const res = await apiClient.post<LoginAdminResponse>(url, { token });
  return res.data.payload.token;
}
