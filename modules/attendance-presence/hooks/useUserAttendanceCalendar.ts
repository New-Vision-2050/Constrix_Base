import { useQuery } from "@tanstack/react-query";
import { UserAttendanceApi } from "@/services/api/user-attendance";

export function useUserAttendanceCalendar(month: number, year: number) {
  return useQuery({
    queryKey: ["user-attendance-calendar", month, year],
    queryFn: async () => {
      const response = await UserAttendanceApi.getCalendar({ month, year });
      return response.data.payload;
    },
  });
}
