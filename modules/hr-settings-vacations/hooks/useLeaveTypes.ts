import { useQuery } from "@tanstack/react-query";
import getLeaveTypes from "../api/get-leave-types";

export const LEAVE_TYPES_OPTIONS_QUERY_KEY = ["leave-types-options"];

export const useLeaveTypes = () =>
  useQuery({
    queryKey: LEAVE_TYPES_OPTIONS_QUERY_KEY,
    queryFn: getLeaveTypes,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
