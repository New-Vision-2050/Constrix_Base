import { useQuery } from '@tanstack/react-query';
import getManagementHierarchies from '../api/getManagementHierarchies';
import { SelectOption } from '@/types/select-option';

/**
 * Custom hook for fetching only branch data using React Query
 * @returns Object containing branches data formatted as SelectOption[], loading state, and error state
 */
export const useBranches = () => {
  const queryKey = ['branches'];

  const { data, isLoading, error, refetch } = useQuery<any[]>({
    queryKey,
    queryFn: () => getManagementHierarchies(),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Filter branches only (type='branch') and map to SelectOption format
  const branches: SelectOption[] = data 
    ? data
        .filter(item => item.type === 'branch')
        .map(branch => ({
          id: branch.id,
          name: branch.name
        }))
    : [];

  return {
    branches,
    isLoading,
    error,
    refetch
  };
};
