import { useQuery } from "@tanstack/react-query";
import GetPersonalUserData from "../api/get-personal-data";

export default function useUserPersonalData() {
  return useQuery({
    queryKey: [`user-profile-personal-data`],
    queryFn: GetPersonalUserData,
  });
}
