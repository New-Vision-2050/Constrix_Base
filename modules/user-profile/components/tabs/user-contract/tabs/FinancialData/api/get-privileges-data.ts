import { apiClient } from "@/config/axios-config";
import { Privilege } from "@/modules/user-profile/types/privilege";

type ResponseT = {
  code: string;
  message: string;
  payload: Privilege[];
};

export default async function GetPrivilegesData() {
  const res = await apiClient.get<ResponseT>(`/privileges`);

  return res.data.payload;
}
