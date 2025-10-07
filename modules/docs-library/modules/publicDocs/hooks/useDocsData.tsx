import { useQuery } from "@tanstack/react-query";
import getDocs from "../apis/get-docs";

export default function useDocsData() {
  return useQuery({
    queryKey: ["docs"], // unique to each id
    queryFn: () => getDocs(),
    refetchOnWindowFocus: false, // don't refetch on tab switch
    // refetchOnReconnect: false,   // don't refetch on network reconnect
    // refetchOnMount: false,       // don't refetch when component remounts
  });
}
