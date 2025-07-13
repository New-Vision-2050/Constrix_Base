import { useQuery } from '@tanstack/react-query';
import getManagementHierarchies from '../api/getManagementHierarchies';

export interface ManagementHierarchyItem {
  id: string;
  name: string;
  parent_id?: string;
  type: string;
}


/**
 * Custom hook for fetching management hierarchies data (branches, departments) using React Query
 * @returns Object containing management hierarchies data, loading state, and error state
 */
export const useManagementHierarchies = () => {
  const queryKey = ['management-hierarchies'];

  return useQuery({
    queryKey,
    queryFn: getManagementHierarchies,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
