import { useQuery } from "@tanstack/react-query";
import GetUserBrief from "../api/get-user-brief";

export default function useUserBriefData(userId: string) {
  return useQuery({
    queryKey: [`user-brief-data`, userId],
    queryFn: () => GetUserBrief(userId),
  });
}
