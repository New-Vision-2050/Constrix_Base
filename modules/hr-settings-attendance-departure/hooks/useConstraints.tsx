import { useQuery } from '@tanstack/react-query';
import getConstraints from '../api/getConstraints';

/**
 * Custom hook for fetching constraints (approvers) using React Query
 * @returns Object containing constraints data, loading state, and error state
 */
export const useConstraintsData = () => {
  const queryKey = ['constraints-data'];

  return useQuery({
    queryKey,
    queryFn: getConstraints,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
