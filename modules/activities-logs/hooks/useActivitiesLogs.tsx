import { useQuery } from "@tanstack/react-query";
import getActivitiesLogs from "../apis/get-activities-logs";

/**
 * Custom hook for fetching constraints (approvers) using React Query
 * @returns Object containing constraints data, loading state, and error state
 */
export const useActivitiesLogs = (limit?: number) => {
  const queryKey = ["activities-logs", limit];

  return useQuery({
    queryKey,
    queryFn: () => getActivitiesLogs(limit),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
