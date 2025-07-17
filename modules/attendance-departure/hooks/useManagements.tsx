import { useQuery } from '@tanstack/react-query';
import getManagementsHierarchies from '../api/getManagementsHierarchies';


/**
 * Custom hook for fetching management hierarchies data (branches, departments) using React Query
 * @returns Object containing management hierarchies data, loading state, and error state
 */
export const useManagements = () => {
  const queryKey = ['management-hierarchies-managements'];

  return useQuery({
    queryKey,
    queryFn: getManagementsHierarchies,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
