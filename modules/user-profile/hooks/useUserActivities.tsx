import getUserActivities from "@/modules/user-profile/api/get-user-activities";
import { useQuery } from "@tanstack/react-query";

export default function useUserActivitiesData(userId?: string,limit?:number) {
  return useQuery({
    queryKey: [`user-activities-data`, userId],
    queryFn: () => getUserActivities(userId,limit),
  });
}
