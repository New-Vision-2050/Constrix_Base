import { useQuery } from "@tanstack/react-query";
import getLeavePolicyCategories from "../api/get-leave-policy-categories";

export const LEAVE_POLICY_CATEGORIES_OPTIONS_QUERY_KEY = [
  "leave-policy-categories-options",
];

export const useLeavePolicyCategories = () =>
  useQuery({
    queryKey: LEAVE_POLICY_CATEGORIES_OPTIONS_QUERY_KEY,
    queryFn: getLeavePolicyCategories,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
