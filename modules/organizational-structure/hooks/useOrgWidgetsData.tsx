import { useQuery } from "@tanstack/react-query";
import fetchOrgWidgetsData from "../api/fetch-org-stucture-widget";

export default function useOrgWidgetsData() {
  return useQuery({
    queryKey: [`org-widget-data`],
    queryFn: fetchOrgWidgetsData,
    refetchOnWindowFocus: false, // don't refetch on tab switch
    // refetchOnReconnect: false,   // don't refetch on network reconnect
    // refetchOnMount: false,       // don't refetch when component remounts
  });
}
