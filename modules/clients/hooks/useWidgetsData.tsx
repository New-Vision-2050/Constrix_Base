import { useQuery } from "@tanstack/react-query";
import getClientWidgets from "../apis/get-client-widgets";

export const useWidgetsData = () => {
  const queryKey = ["widgets-data"];

  return useQuery({
    queryKey,
    queryFn: () => getClientWidgets(),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
