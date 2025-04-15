import { useQuery } from "@tanstack/react-query";
import GetUserCoursesData from "../api/get-user-courses-data";

export default function useUserCoursesData(userId: string) {
  return useQuery({
    queryKey: [`user-courses-data`, userId],
    queryFn: () => GetUserCoursesData(userId),
  });
}
