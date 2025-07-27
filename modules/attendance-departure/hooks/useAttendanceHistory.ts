import { useState, useCallback } from "react";
import { getAttendanceHistory, AttendanceHistoryParams } from "../api/getAttendanceHistory";
import { AttendanceHistoryRecord, AttendanceStatusRecord, AttendanceHistoryPayload } from "../types/attendance";

interface UseAttendanceHistoryReturn {
  // Original payload structure with time range keys
  attendanceHistoryPayload: AttendanceHistoryPayload[];
  // Flattened array for backward compatibility
  attendanceHistory: AttendanceHistoryRecord[];
  loading: boolean;
  error: Error | null;
  fetchAttendanceHistory: (id: string, startDate: string, endDate: string) => Promise<void>;
  refetch: () => void;
  setAttendanceHistory: (history: AttendanceHistoryRecord[]) => void;
  setAttendanceHistoryPayload: (payload: AttendanceHistoryPayload[]) => void;
}

/**
 * Custom hook for managing attendance history data
 * @returns Object containing attendance history data, loading state, error state, and fetch functions
 */
export const useAttendanceHistory = (): UseAttendanceHistoryReturn => {
  const [attendanceHistoryPayload, setAttendanceHistoryPayload] = useState<AttendanceHistoryPayload[]>([]);
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
      
      // Store the original payload structure
      setAttendanceHistoryPayload(response.payload);
      
      // Flatten the payload structure - extract all records from dynamic time range keys
      // Preserve the timeRange key (e.g., "2025-07-27 09:00 - 2025-07-27 02:00") in each record
      const allRecords: AttendanceHistoryRecord[] = [];
      response.payload.forEach(timeRangeObj => {
        Object.entries(timeRangeObj).forEach(([timeRange, records]) => {
          // Skip the total_hours property, only process time range keys with record arrays
          if (timeRange !== 'total_hours' && Array.isArray(records)) {
            // Add timeRange information to each record
            const recordsWithTimeRange = records.map((record: AttendanceHistoryRecord) => ({
              ...record,
              timeRange
            }));
            allRecords.push(...recordsWithTimeRange);
          }
        });
      });
      
      setAttendanceHistory(allRecords);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch attendance history'));
      setAttendanceHistoryPayload([]);
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
    attendanceHistoryPayload,
    attendanceHistory,
    loading,
    error,
    fetchAttendanceHistory,
    refetch,
    setAttendanceHistory,
    setAttendanceHistoryPayload,
  };
};
