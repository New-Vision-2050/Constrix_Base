import { useQuery } from "@tanstack/react-query";
import getProfileDataStatus from "../api/get-data-status";

export default function useProfileDataStatus(id: string) {
  return useQuery({
    queryKey: [`user-profile-data-status`],
    queryFn: () => getProfileDataStatus(id),
  });
}
