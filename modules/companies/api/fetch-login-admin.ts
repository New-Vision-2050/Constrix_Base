import { apiClient } from "@/config/axios-config";

interface LoginAdminResponse {
  code: string;
  message: string | null;
  payload: {
    token: string;
  };
}

<<<<<<< HEAD
export default async function fetchLoginAdmin(token: string) {
=======

export default async function fetchLoginAdmin( token: string) {
>>>>>>> 7239737f37cdb3e9611db8ef52b613c67f5f0399
  const url = `/auths/login-as-admin`;
  const res = await apiClient.post<LoginAdminResponse>(url, { token });
  return res.data.payload.token;
}
