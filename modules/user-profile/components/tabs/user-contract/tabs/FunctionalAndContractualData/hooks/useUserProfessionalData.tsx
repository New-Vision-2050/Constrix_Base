import { useQuery } from "@tanstack/react-query";
import GetProfessionalData from "../api/get-professinal-data";

export default function useProfessionalData(userId: string) {
  return useQuery({
    queryKey: [`user-professional-data`, userId],
    queryFn: () => GetProfessionalData(userId),
  });
}
