import { useQuery } from "@tanstack/react-query";
import GetUserContactInfoData from "../api/get-address-data";

export default function useUserContactInfoData(userId: string) {
  return useQuery({
    queryKey: [`user-address-data`, userId],
    queryFn: () => GetUserContactInfoData(userId),
  });
}
