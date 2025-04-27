import { useQuery } from "@tanstack/react-query";
import getProfileWidgetsData from "../api/fetch-widget-data";

export default function useProfileWidgetData(id: string) {
  return useQuery({
    queryKey: [`user-profile-widget-data`, id],
    queryFn: () => getProfileWidgetsData(id),
    enabled: !!id, // run only if id is truthy
    refetchOnWindowFocus: false, // don't refetch on tab switch
    // refetchOnReconnect: false,   // don't refetch on network reconnect
    // refetchOnMount: false,       // don't refetch when component remounts
  });
}
