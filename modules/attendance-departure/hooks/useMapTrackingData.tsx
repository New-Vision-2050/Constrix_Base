import { useQuery } from '@tanstack/react-query';
import { getMapLiveTracking } from '../api/map-live-tracking';
import { MapEmployee } from '../components/map/types';

/**
 * Props for the useTeamAttendance hook
 */
interface UseMapTrackingDataProps {
  start_date?: string;
  end_date?: string;
  search_text?: string;
  approver?: string;
  department?: string;
  branch?: string;
}

/**
 * Custom hook for fetching team attendance data using React Query
 * @param props Optional configuration including start_date and end_date
 * @returns Object containing team attendance data, loading state, and error state
 */
export const useMapTrackingData = (props?: UseMapTrackingDataProps) => {
  const { start_date, end_date, search_text, approver, department, branch } = props || {};

  // Include all search params in queryKey to refetch when any of them changes
  const queryKey = [
    'map-tracking-data', 
    start_date, 
    end_date, 
    search_text || '', 
    // For select items, treat 'all' the same as undefined
    approver === 'all' ? undefined : approver, 
    department === 'all' ? undefined : department, 
    branch === 'all' ? undefined : branch
  ];



  const { data, isLoading, error, refetch } = useQuery<MapEmployee[]>({
    queryKey,
    // Pass all search parameters including search_text
    queryFn: () => getMapLiveTracking({ 
      start_date, 
      end_date,
      search_text,
      approver: approver === 'all' ? undefined : approver,
      department: department === 'all' ? undefined : department,
      branch: branch === 'all' ? undefined : branch
    }),
    refetchOnWindowFocus: false, // don't refetch on tab switch
    // refetchOnReconnect: false,   // don't refetch on network reconnect
    // refetchOnMount: false,       // don't refetch when component remounts
  });

  return {
    teamAttendance: data || [],
    isLoading,
    error: error instanceof Error ? error : null,
    refetch
  };
};
