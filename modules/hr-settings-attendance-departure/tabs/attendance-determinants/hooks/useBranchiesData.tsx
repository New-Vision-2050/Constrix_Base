import { useQuery } from "@tanstack/react-query";
import getBranches from "../api/get-branches";

/**
 * Custom hook for fetching constraints (approvers) using React Query
 * @returns Object containing constraints data, loading state, and error state
 */
export const useBranchiesData = () => {
  const queryKey = ["branchies-data"];

  return useQuery({
    queryKey,
    queryFn: getBranches,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
