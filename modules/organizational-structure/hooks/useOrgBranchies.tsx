import { useQuery } from "@tanstack/react-query";
import fetchOrgBranchiesData from "../api/fetch-company-branchies";

export default function useOrgBranchiesData() {
  return useQuery({
    queryKey: [`org-branchies-data`],
    queryFn: fetchOrgBranchiesData,
    refetchOnWindowFocus: false, // don't refetch on tab switch
    // refetchOnReconnect: false,   // don't refetch on network reconnect
    // refetchOnMount: false,       // don't refetch when component remounts
  });
}
