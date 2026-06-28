import { useQuery } from '@tanstack/react-query';
import {
  getAllConstraintsForSelect,
  CONSTRAINTS_PER_PAGE,
  Constraint,
} from '../api/getConstraints';

/**
 * Custom hook for fetching constraints (approvers) using React Query
 * @returns Object containing constraints data, loading state, and error state
 */
export const useConstraints = () => {
  const queryKey = ['constraints', CONSTRAINTS_PER_PAGE];

  return useQuery({
    queryKey,
    queryFn: getAllConstraintsForSelect,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export type { Constraint };
