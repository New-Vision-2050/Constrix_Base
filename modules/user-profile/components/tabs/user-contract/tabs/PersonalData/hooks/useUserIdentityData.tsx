import { useQuery } from "@tanstack/react-query";
import GetUserIdentityData from "../api/get-identity-data";

export default function useUserIdentityData(userId?: string) {
  return useQuery({
    queryKey: [`user-profile-identity-data`, userId],
    queryFn: () => GetUserIdentityData(userId),
  });
}
