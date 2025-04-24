import { useQuery } from "@tanstack/react-query";
import GetPersonalUserData from "../api/get-personal-data";

export default function useUserPersonalData(userId?: string) {
  return useQuery({
    queryKey: [`user-profile-personal-data`, userId],
    queryFn: () => GetPersonalUserData(userId),
  });
}
