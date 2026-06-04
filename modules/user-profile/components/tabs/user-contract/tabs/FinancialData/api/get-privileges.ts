import { apiClient } from "@/config/axios-config";
import { UserPrivilege } from "@/modules/user-profile/types/privilege";

type ResponseT = {
  code: string;
  message: string;
  payload: UserPrivilege[];
};

export default async function GetPrivileges(userId: string) {
  const res = await apiClient.get<ResponseT>(`/user_privileges/user/${userId}?type=health_insurance`);

  return res.data.payload;
}
