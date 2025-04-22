import { useQuery } from "@tanstack/react-query";
import GetQualificationsData from "../api/get-qualifications-data";

export default function useUserQualifications(userId: string) {
  return useQuery({
    queryKey: [`user-qualifications-data`, userId],
    queryFn: () => GetQualificationsData(userId),
  });
}
