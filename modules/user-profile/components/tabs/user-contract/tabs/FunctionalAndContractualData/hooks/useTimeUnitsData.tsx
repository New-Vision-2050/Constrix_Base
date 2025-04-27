import { useQuery } from "@tanstack/react-query";
import GetTimeUnitsData from "../api/get-time-units";

export default function useTimeUnitsData() {
  return useQuery({
    queryKey: [`user-contract-data`],
    queryFn: GetTimeUnitsData,
  });
}
