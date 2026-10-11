import { useQuery } from "@tanstack/react-query";
import getLeaveTypes from "../api/get-leave-types";

export const useLeaveTypes = () =>
  useQuery({
    queryKey: ["leave-types-options"],
    queryFn: getLeaveTypes,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
