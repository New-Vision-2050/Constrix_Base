import { useQuery } from "@tanstack/react-query";
import GetPrivileges from "../api/get-privileges";

export default function usePrivileges(userId: string) {
  return useQuery({
    queryKey: [`user-privileges`, userId],
    queryFn: () => GetPrivileges(userId),
  });
}
