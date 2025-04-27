import { useQuery } from "@tanstack/react-query";
import fetchUserProfileData from "../api/fetch-user-profile-data";

export default function useUserProfileData(userId?: string) {
  return useQuery({
    queryKey: [`user-profile-data`, userId],
    queryFn: () => fetchUserProfileData(userId),
    // enabled: !!userId, // run only if id is truthy
    refetchOnWindowFocus: false, // don't refetch on tab switch
    // refetchOnReconnect: false,   // don't refetch on network reconnect
    // refetchOnMount: false,       // don't refetch when component remounts
  });
}
