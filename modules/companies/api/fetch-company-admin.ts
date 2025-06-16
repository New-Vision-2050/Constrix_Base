import { apiClient } from "@/config/axios-config";

type ResponseT = {
  code: string;
  message: string;
  payload: CompanyAdmin;
};

type CompanyAdmin ={
    url:string;
    token:string;
};

export default async function fetchCompanyAdmin(CompanyId?: string) {
  const url = `/auths/get-data-for-login-as-admin?company_id=${CompanyId}`;

  const res = await apiClient.get<ResponseT>(url);
  console.log(res.data.payload);

  return res.data.payload;
}

