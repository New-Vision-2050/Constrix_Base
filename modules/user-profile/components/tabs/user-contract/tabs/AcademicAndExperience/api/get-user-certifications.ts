import { apiClient } from "@/config/axios-config";
import { Certification } from "@/modules/user-profile/types/Certification";

type ResponseT = {
  code: string;
  message: string;
  payload: Certification[];
};

export default async function GetCertificationsData(userId: string) {
  const res = await apiClient.get<ResponseT>(
    `/professional_certificates/user/${userId}`
  );

  return res.data.payload;
}
