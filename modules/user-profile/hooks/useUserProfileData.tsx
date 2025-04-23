import { useQuery } from "@tanstack/react-query";
import fetchUserProfileData from "../api/fetch-user-profile-data";

export default function useUserProfileData(userId?: string) {
  return useQuery({
    queryKey: [`user-profile-data`, userId],
    queryFn: () => fetchUserProfileData(userId),
  });
}
