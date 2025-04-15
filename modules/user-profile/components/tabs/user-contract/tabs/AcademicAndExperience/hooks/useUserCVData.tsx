import { useQuery } from "@tanstack/react-query";
import GetUserCV from "../api/get-user-cv";

export default function useUserCVData(userId: string) {
  return useQuery({
    queryKey: [`user-cv-data`, userId],
    queryFn: () => GetUserCV(userId),
  });
}
