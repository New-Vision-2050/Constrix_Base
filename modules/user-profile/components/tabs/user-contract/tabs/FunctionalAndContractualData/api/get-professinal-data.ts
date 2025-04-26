import { apiClient } from "@/config/axios-config";
import { Branch } from "@/modules/user-profile/types/branch";
import { Department } from "@/modules/user-profile/types/department";
import { Management } from "@/modules/user-profile/types/mangement";

export type ProfessionalT = {
  branch: Branch;
  company_id: string;
  department: Department;
  global_id: string;
  id: string;
  job_code: string;
  job_title: string;
  job_type: { id: string; name: string };
  management: Management;
};

type ResponseT = {
  code: string;
  message: string;
  payload: ProfessionalT;
};

export default async function GetProfessionalData(userId: string) {
  const res = await apiClient.get<ResponseT>(
    `/user_professional_data/user/${userId}`
  );

  return res.data.payload;
}
