import { useQuery } from "@tanstack/react-query";
import GetCertificationsData from "../api/get-user-certifications";

export default function useUserCertificationsData(userId: string) {
  return useQuery({
    queryKey: [`user-certification-data`, userId],
    queryFn: () => GetCertificationsData(userId),
  });
}
