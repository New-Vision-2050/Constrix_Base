import { useQuery } from "@tanstack/react-query";
import GetUserRelativesData from "../api/get-relatives-data";

export default function useUserRelativesData(userId: string) {
  return useQuery({
    queryKey: [`user-relatives-data`, userId],
    queryFn: () => GetUserRelativesData(userId),
  });
}
