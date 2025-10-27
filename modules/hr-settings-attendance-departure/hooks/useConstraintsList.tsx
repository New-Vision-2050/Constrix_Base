import { useQuery } from '@tanstack/react-query';
import getConstraints from '../api/getConstraints';

type Props = {
  limit?: number;
  page?: number;
}
/**
 * Custom hook for fetching constraints (approvers) using React Query
 * @returns Object containing constraints data, loading state, and error state
 */
export const useConstraintsList = ({limit,page}:Props) => {
  const queryKey = ['constraints-data',limit,page];

  return useQuery({
    queryKey,
    queryFn: () => getConstraints({limit,page}),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
