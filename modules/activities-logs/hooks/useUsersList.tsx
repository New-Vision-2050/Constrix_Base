import { useQuery } from "@tanstack/react-query";
import getUsersList from "../apis/get-users-list";

/**
 * Custom hook for fetching users list using React Query
 * @returns Object containing users list data, loading state, and error state
 */
export const useUsersList = () => {
  const queryKey = ["users-list"];

  return useQuery({
    queryKey,
    queryFn: () => getUsersList(),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
