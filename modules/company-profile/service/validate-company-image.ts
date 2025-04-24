import { serialize } from "object-to-formdata";
import { apiClient } from "@/config/axios-config";
import { ValidCompanyProfileImage } from "../types/valdation-message-company-image";

type ResponseT = {
  code: string;
  message: string;
  payload: ValidCompanyProfileImage[];
};

export default async function validCompanyProfileImage(image: File) {
  const res = await apiClient.post<ResponseT>(
    `/companies/company-profile/validate-logo`,
    serialize({ logo: image })
  );

  return res.data.payload;
}
