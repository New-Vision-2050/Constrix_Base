import { useState, useCallback } from "react";
import { getAttendanceHistory, AttendanceHistoryParams } from "../api/getAttendanceHistory";
import { AttendanceHistoryRecord, AttendanceStatusRecord } from "../types/attendance";

interface UseAttendanceHistoryReturn {
  attendanceHistory: AttendanceHistoryRecord[];
  loading: boolean;
  error: Error | null;
  fetchAttendanceHistory: (id: string, startDate: string, endDate: string) => Promise<void>;
  refetch: () => void;
  setAttendanceHistory: (history: AttendanceHistoryRecord[]) => void;
}

/**
 * Custom hook for managing attendance history data
 * @returns Object containing attendance history data, loading state, error state, and fetch functions
 */
export const useAttendanceHistory = (): UseAttendanceHistoryReturn => {
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceHistoryRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastParams, setLastParams] = useState<{id: string, startDate: string, endDate: string} | null>(null);
  const fetchAttendanceHistory = useCallback(async (id: string, startDate: string, endDate: string) => {
    try {
      setLoading(true);
      setError(null);
      setLastParams({id, startDate, endDate});
      const response = await getAttendanceHistory(id, startDate, endDate);
      setAttendanceHistory(response.payload);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch attendance history'));
      setAttendanceHistory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    if (lastParams) {
      fetchAttendanceHistory(lastParams.id, lastParams.startDate, lastParams.endDate);
    }
  }, [lastParams]);

  return {
    attendanceHistory,
    loading,
    error,
    fetchAttendanceHistory,
    refetch,
    setAttendanceHistory,
  };
};
