import { useQuery } from "@tanstack/react-query";
import GetUserConnectionData from "../api/get-user-connection-data";

export default function useUserConnectionData(userId?: string) {
  return useQuery({
    queryKey: [`user-profile-connection-data`, userId],
    queryFn: () => GetUserConnectionData(userId),
  });
}
