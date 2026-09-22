import { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import getPublicHolidayBranches from "../api/get-public-holiday-branches";

export const PUBLIC_HOLIDAY_BRANCHES_QUERY_KEY = [
  "public-holidays-branches",
] as const;

export type BranchYearCard = {
  id: string;
  name: string;
  years: number[];
};

export function usePublicHolidayBranchCards() {
  const currentYear = new Date().getFullYear();
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: PUBLIC_HOLIDAY_BRANCHES_QUERY_KEY,
    queryFn: getPublicHolidayBranches,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000,
  });

  const cards = useMemo<BranchYearCard[]>(
    () =>
      (data ?? []).map((branch) => ({
        id: String(branch.branch_id),
        name: branch.name,
        years: Array.isArray(branch.years)
          ? branch.years.filter((year) => Number.isFinite(Number(year)))
          : [],
      })),
    [data]
  );

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: PUBLIC_HOLIDAY_BRANCHES_QUERY_KEY });

  return {
    cards,
    currentYear,
    isLoading,
    refetch,
    invalidate,
  };
}
