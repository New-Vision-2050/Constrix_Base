import { useQuery } from "@tanstack/react-query";
import fetchUserInfoAlert from "../api/fetch-user-info-alert";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";

export default function useUserInfoAlert() {
  const { userId } = useUserProfileCxt();

  return useQuery({
    queryKey: ["user-info-alert", userId],
    queryFn: () => fetchUserInfoAlert(userId as string),
    enabled: !!userId,
  });
}
