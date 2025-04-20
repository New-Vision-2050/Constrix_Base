import { useQuery } from "@tanstack/react-query";
import GetUserStatusData from "../api/get-user-status";

export default function useUserStatusData(userId: string) {
  return useQuery({
    queryKey: [`user-salary-data`, userId],
    queryFn: () => GetUserStatusData(userId),
  });
}
