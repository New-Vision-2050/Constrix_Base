import { useQuery } from '@tanstack/react-query';
import { getTeamAttendance } from "../api/getTeamAttendance";
import { AttendanceStatusRecord } from "../types/attendance";

/**
 * Custom hook for fetching team attendance data using React Query
 * @returns Object containing team attendance data, loading state, and error state
 */
export const useTeamAttendance = () => {
  const { data, isLoading, error, refetch } = useQuery<AttendanceStatusRecord[]>({
    queryKey: ['team-attendance'],
    queryFn: () => getTeamAttendance(),
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
