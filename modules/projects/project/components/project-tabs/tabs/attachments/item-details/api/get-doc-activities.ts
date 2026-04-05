import { apiClient } from "@/config/axios-config";
import { UserActivityT } from "@/modules/user-profile/types/user-activity";

// API response type
type ResponseT = {
  code: string;
  message: string;
  payload: UserActivityT[];
};

export default async function getDocActivityLogs(
  docId?: string,
  type?: string
) {
  const res = await apiClient.get<ResponseT>(`/folders/${docId}/audits`, {
    params: {
      type,
    },
  });

  return res.data.payload;
}
