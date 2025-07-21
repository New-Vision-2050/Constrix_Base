import { useQuery } from '@tanstack/react-query';
import getHierarchies from '../api/getHierarchies';

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
export const useBranchesHierarchies = () => {
  const queryKey = ['branches-management-hierarchies'];

  return useQuery({
    queryKey,
    queryFn: () => getHierarchies('branch'),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
