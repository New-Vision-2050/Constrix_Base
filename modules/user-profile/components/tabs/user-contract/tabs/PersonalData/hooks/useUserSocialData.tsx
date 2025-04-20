import { useQuery } from "@tanstack/react-query";
import GetUserSocialData from "../api/get-social-data";

export default function useUserSocialData(userId: string) {
  return useQuery({
    queryKey: [`user-social-data`, userId],
    queryFn: () => GetUserSocialData(userId),
  });
}
