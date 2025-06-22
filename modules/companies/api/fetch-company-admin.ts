import { apiClient } from "@/config/axios-config";

type ResponseT = {
  code: string;
  message: string;
  payload: CompanyAdmin;
};

<<<<<<< HEAD
type CompanyAdmin = {
  url: string;
  token: string;
=======
type CompanyAdmin ={
    url:string;
    token:string;
>>>>>>> 7239737f37cdb3e9611db8ef52b613c67f5f0399
};

export default async function fetchCompanyAdmin(CompanyId?: string) {
  const url = `/auths/get-data-for-login-as-admin?company_id=${CompanyId}`;

  const res = await apiClient.get<ResponseT>(url);
  console.log(res.data.payload);

  return res.data.payload;
}
<<<<<<< HEAD
=======

>>>>>>> 7239737f37cdb3e9611db8ef52b613c67f5f0399
