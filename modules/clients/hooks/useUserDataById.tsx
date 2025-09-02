import { useQuery } from "@tanstack/react-query";
import getUserDataById from "../apis/get-user-data";

export const useUserDataById = (id: string) => {
  const queryKey = ["user-data-by-id", id];

  return useQuery({
    queryKey,
    queryFn: () => getUserDataById(id),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
