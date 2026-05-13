import { useQuery } from "@tanstack/react-query";
import GetAdditionalConstraints from "../api/get-additional-constraints";

export default function useAdditionalConstraints(userId: string) {
  return useQuery({
    queryKey: ["user-additional-constraints", userId],
    queryFn: () => GetAdditionalConstraints(userId),
    enabled: Boolean(userId),
  });
}
