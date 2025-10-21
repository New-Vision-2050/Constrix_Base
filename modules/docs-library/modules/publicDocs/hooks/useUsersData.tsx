import { useQuery } from "@tanstack/react-query";
import getUsersData from "../apis/get-users-data";

export default function useUsersData() {
  return useQuery({
    queryKey: ["users-list"], // unique to each id
    queryFn: () => getUsersData(),
    refetchOnWindowFocus: false, // don't refetch on tab switch
    // refetchOnReconnect: false,   // don't refetch on network reconnect
    // refetchOnMount: false,       // don't refetch when component remounts
  });
}
