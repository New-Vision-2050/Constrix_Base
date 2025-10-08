import { useQuery } from "@tanstack/react-query";
import getDocs from "../apis/get-docs";

export default function useDocsData(
  branchId?: string,
  parentId?: string,
  password?: string
) {
  return useQuery({
    queryKey: ["docs", branchId, parentId, password], // unique to each id
    queryFn: () => getDocs(branchId, parentId, password),
    refetchOnWindowFocus: false, // don't refetch on tab switch
    // refetchOnReconnect: false,   // don't refetch on network reconnect
    // refetchOnMount: false,       // don't refetch when component remounts
  });
}
