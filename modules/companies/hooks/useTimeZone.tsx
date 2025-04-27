import { useQuery } from "@tanstack/react-query";
import fetchTimeZones from "../api/fetch-time-zone";

export default function useTimeZone(countryId?: string) {
  return useQuery({
    queryKey: [`time-zones-data`,countryId],
    queryFn: () => fetchTimeZones(countryId),
  });
}
