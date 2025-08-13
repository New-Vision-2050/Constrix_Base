import { useQuery } from "@tanstack/react-query";
import getCities from "../api/get-cities";

/**
 * Custom hook for fetching constraints (approvers) using React Query
 * @returns Object containing constraints data, loading state, and error state
 */
export const useCitiesData = () => {
  const queryKey = ["cities-data"];

  return useQuery({
    queryKey,
    queryFn: getCities,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
