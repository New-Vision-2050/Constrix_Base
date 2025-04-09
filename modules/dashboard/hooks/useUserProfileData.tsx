import { useQuery } from "@tanstack/react-query";
import fetchUserProfileData from "../api/fetch-user-profile-data";

export default function useUserProfileData() {
  return useQuery({
    queryKey: [`user-profile-data`],
    queryFn: fetchUserProfileData,
  });
}
