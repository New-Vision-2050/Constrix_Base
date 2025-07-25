import { useState, useCallback } from "react";
import { getAttendanceHistory, AttendanceHistoryParams } from "../api/getAttendanceHistory";
import { AttendanceHistoryRecord, AttendanceStatusRecord } from "../types/attendance";

interface UseAttendanceHistoryReturn {
  attendanceHistory: AttendanceHistoryRecord[];
  loading: boolean;
  error: Error | null;
  fetchAttendanceHistory: (record: AttendanceStatusRecord) => Promise<void>;
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
  const [lastParams, setLastParams] = useState<AttendanceStatusRecord | null>(null);
  const fetchAttendanceHistory = useCallback(async (record: AttendanceStatusRecord) => {
    try {
      setLoading(true);
      setError(null);
      setLastParams(record);
      const response = await getAttendanceHistory(record);
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
      fetchAttendanceHistory(lastParams);
    }
  }, [lastParams, fetchAttendanceHistory]);

  return {
    attendanceHistory,
    loading,
    error,
    fetchAttendanceHistory,
    refetch,
    setAttendanceHistory,
  };
};
