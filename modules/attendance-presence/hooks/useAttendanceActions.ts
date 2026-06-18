import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserAttendanceApi } from "@/services/api/user-attendance";

export const USER_CONSTRAINT_TODAY_QUERY_KEY = "user-constraint-today";
export const USER_ATTENDANCE_CALENDAR_QUERY_KEY = "user-attendance-calendar";

export function useUserConstraintToday() {
  return useQuery({
    queryKey: [USER_CONSTRAINT_TODAY_QUERY_KEY],
    queryFn: async () => {
      const response = await UserAttendanceApi.getTodayConstraint();
      return response.data.payload;
    },
  });
}

export function useClockInMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UserAttendanceApi.clockIn,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [USER_CONSTRAINT_TODAY_QUERY_KEY],
        }),
        queryClient.invalidateQueries({
          queryKey: [USER_ATTENDANCE_CALENDAR_QUERY_KEY],
        }),
      ]);
    },
  });
}

export function useClockOutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UserAttendanceApi.clockOut,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [USER_CONSTRAINT_TODAY_QUERY_KEY],
        }),
        queryClient.invalidateQueries({
          queryKey: [USER_ATTENDANCE_CALENDAR_QUERY_KEY],
        }),
      ]);
    },
  });
}
