import { apiClient } from "@/config/axios-config";
import { JobOffer } from "@/modules/user-profile/types/job-offer";

type ResponseT = {
  code: string;
  message: string;
  payload: JobOffer;
};

export default async function GetUserJobOffersData(userId: string) {
  const res = await apiClient.get<ResponseT>(`/job_offers/user${Boolean(userId) ? "/" + userId : ""}`);

  return res.data.payload;
}
