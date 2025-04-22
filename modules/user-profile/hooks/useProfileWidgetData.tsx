import { useQuery } from "@tanstack/react-query";
import getProfileWidgetsData from "../api/fetch-widget-data";

export default function useProfileWidgetData(id: string) {
  return useQuery({
    queryKey: [`user-profile-widget-data`],
    queryFn: () => getProfileWidgetsData(id),
  });
}
