import { useQuery } from "@tanstack/react-query";
import getUserLeaveRequests from "../api/get-user-leave-requests";

export function userLeaveRequestsQueryKey(
  userId: string,
  filters: { status?: string; year?: number; page: number; perPage: number },
) {
  return ["user-leave-requests", userId, filters] as const;
}

/** Paginated admin list of the user's leave requests (optional profile tab). */
export default function useUserLeaveRequests(filters: {
  userId: string;
  status?: string;
  year?: number;
  page: number;
  perPage: number;
}) {
  const { userId, status, year, page, perPage } = filters;

  return useQuery({
    queryKey: userLeaveRequestsQueryKey(userId, {
      status,
      year,
      page,
      perPage,
    }),
    queryFn: () =>
      getUserLeaveRequests({ userId, status, year, page, perPage }),
    enabled: Boolean(userId),
    refetchOnWindowFocus: false,
    placeholderData: (previous) => previous,
  });
}
