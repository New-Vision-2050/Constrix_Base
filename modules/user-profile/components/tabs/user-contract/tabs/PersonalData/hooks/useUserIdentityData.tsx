import { useQuery } from "@tanstack/react-query";
import GetUserIdentityData from "../api/get-identity-data";

export default function useUserIdentityData() {
  return useQuery({
    queryKey: [`user-profile-identity-data`],
    queryFn: GetUserIdentityData,
  });
}
