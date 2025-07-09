import { useQuery } from '@tanstack/react-query';
import { getAttendanceSummary, AttendanceSummaryData } from '../api/attendanceSummary';

interface UseAttendanceSummaryProps {
  start_date?: string;
  end_date?: string;
}

/**
 * Custom hook for fetching attendance summary data using React Query
 * @param props Optional configuration including start_date and end_date
 * @returns Object containing attendance summary data, loading state, and error state
 */
export const useAttendanceSummary = (props?: UseAttendanceSummaryProps) => {
  const { start_date, end_date } = props || {};
  
  const queryKey = ['attendance-summary', start_date, end_date];
  
  const { data, isLoading, error, refetch } = useQuery<AttendanceSummaryData>({
    queryKey,
    queryFn: () => getAttendanceSummary({ start_date, end_date }),
    refetchOnWindowFocus: false, // don't refetch on tab switch
  });

  return {
    attendanceSummary: data || null,
    attendanceSummaryLoading: isLoading,
    attendanceSummaryError: error instanceof Error ? error : null,
    refetchAttendanceSummary: refetch
  };
};

export default useAttendanceSummary;
