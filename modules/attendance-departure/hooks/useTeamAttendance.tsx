import { useQuery } from '@tanstack/react-query';
import { getTeamAttendance, GetTeamAttendanceParams } from "../api/getTeamAttendance";
import { AttendanceStatusRecord } from "../types/attendance";

/**
 * Props for the useTeamAttendance hook
 */
interface UseTeamAttendanceProps {
  start_date?: string;
  end_date?: string;
}

/**
 * Custom hook for fetching team attendance data using React Query
 * @param props Optional configuration including start_date and end_date
 * @returns Object containing team attendance data, loading state, and error state
 */
export const useTeamAttendance = (props?: UseTeamAttendanceProps) => {
  const { start_date, end_date } = props || {};

  // Include date params in queryKey to refetch when they change
  const queryKey = ['team-attendance', start_date, end_date];

  const { data, isLoading, error, refetch } = useQuery<AttendanceStatusRecord[]>({
    queryKey,
    queryFn: () => getTeamAttendance({ start_date, end_date }),
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
