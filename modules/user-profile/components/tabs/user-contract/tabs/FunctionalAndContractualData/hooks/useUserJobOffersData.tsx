import { useQuery } from "@tanstack/react-query";
import GetUserJobOffersData from "../api/get-job-offers-data";

export default function useUserJobOffersData(userId: string) {
  return useQuery({
    queryKey: [`user-job-offers-data`, userId],
    queryFn: () => GetUserJobOffersData(userId),
  });
}
