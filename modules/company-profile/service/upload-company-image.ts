import { serialize } from "object-to-formdata";
import { apiClient } from "@/config/axios-config";

type ResponseT = {
  code: string;
  message: string;
  payload: { logo: string };
};

export default async function uploadCompanyImage(
  image: File,
  company_id: string,
) {
  const res = await apiClient.post<ResponseT>(
    `/companies/company-profile/assign-logo`,
    serialize({ logo: image, company_id }),
    { params: { company_id } },
  );

  return res.data.payload;
}
