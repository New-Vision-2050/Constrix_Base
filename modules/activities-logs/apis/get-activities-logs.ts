import { apiClient } from "@/config/axios-config";
import { UserActivityT } from "@/modules/user-profile/types/user-activity";
import { SearchUserActivityLogT } from "../context/ActivitiesLogsCxt";

export type ActivitiesLogsT = {
  [key: string]: UserActivityT[];
};
// API response type
type ResponseT = {
  code: string;
  message: string;
  payload: ActivitiesLogsT;
};

export default async function getActivitiesLogs(limit?: number, searchFields?: SearchUserActivityLogT) {
  const res = await apiClient.get<ResponseT>(`/audits/activity-log`, {
    params: {
      limit: limit ?? 10,
      ...searchFields,
    },
  });

  return res.data.payload;
}
