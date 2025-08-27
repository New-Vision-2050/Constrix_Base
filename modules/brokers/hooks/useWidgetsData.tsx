import { useQuery } from "@tanstack/react-query";
import getBrokerWidgets from "../apis/get-broker-widgets";

export const useWidgetsData = () => {
  const queryKey = ["widgets-data"];

  return useQuery({
    queryKey,
    queryFn: () => getBrokerWidgets(),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
