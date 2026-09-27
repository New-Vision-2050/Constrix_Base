import { apiClient } from "@/config/axios-config";
import { PublicHolidayBranchCard } from "../types/PublicVacation";

type ResponseT = {
  payload?: PublicHolidayBranchCard[];
};

export default async function getPublicHolidayBranches() {
  const res = await apiClient.get<ResponseT>("/public-holidays/branches");
  return res.data.payload ?? [];
}
