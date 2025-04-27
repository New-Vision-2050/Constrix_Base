import { useQuery } from "@tanstack/react-query";
import getProfileDataStatus from "../api/get-data-status";

export default function useProfileDataStatus(id: string) {
  return useQuery({
    queryKey: ["user-profile-data-status", id], // unique to each id
    queryFn: () => getProfileDataStatus(id),
    enabled: !!id, // run only if id is truthy
    refetchOnWindowFocus: false, // don't refetch on tab switch
    // refetchOnReconnect: false,   // don't refetch on network reconnect
    // refetchOnMount: false,       // don't refetch when component remounts
  });
}
