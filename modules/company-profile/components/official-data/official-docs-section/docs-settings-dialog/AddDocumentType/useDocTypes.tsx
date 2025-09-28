import { useQuery } from "@tanstack/react-query";
import getDocTypes from "./api/get-doc-types";

export const useDocTypes = () => {
  const queryKey = ["doc-types"];

  return useQuery({
    queryKey,
    queryFn: () => getDocTypes(),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
