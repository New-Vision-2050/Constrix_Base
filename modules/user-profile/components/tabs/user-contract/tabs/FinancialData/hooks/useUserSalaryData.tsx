import { useQuery } from "@tanstack/react-query";
import GetUserSalaryData from "../api/get-user-salary-data";

export default function useUserSalaryData(userId: string) {
  return useQuery({
    queryKey: [`user-salary-data`, userId],
    queryFn: () => GetUserSalaryData(userId),
  });
}
