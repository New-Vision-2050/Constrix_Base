import { useQuery } from "@tanstack/react-query";
import { fetchTimeZones } from "../services/LookupsService";

export const useTimeZonesData = () => {
  return useQuery({
    queryKey: [`time-zones-data`],
    queryFn: fetchTimeZones,
  });
};
