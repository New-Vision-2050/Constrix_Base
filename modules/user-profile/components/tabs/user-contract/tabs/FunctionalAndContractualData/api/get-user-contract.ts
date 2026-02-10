import { apiClient } from "@/config/axios-config";
import { Contract } from "@/modules/user-profile/types/Contract";

type ResponseT = {
  code: string;
  message: string;
  payload: Contract;
};

export default async function GetUserContractData(userId: string) {
  console.log("🔍 Fetching contract data for userId:", userId);
  const res = await apiClient.get<ResponseT>(
    `/contractual-relationship/${userId}`
  );

  console.log("📦 API Response:", res.data);
  console.log("📋 Contract Payload:", res.data.payload);
  
  return res.data.payload;
}
