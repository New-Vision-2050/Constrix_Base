"use client";

import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { CONSTRAINTS_PER_PAGE } from "@/modules/attendance-departure/api/getConstraints";
import { fetchConstraintsPage } from "./api";
import type { DropdownOption } from "./types";

export function usePaginatedConstraintOptions() {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["attendance-filter-constraints", CONSTRAINTS_PER_PAGE],
    queryFn: ({ pageParam }) => fetchConstraintsPage(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.hasMore ? lastPageParam + 1 : undefined,
    staleTime: 5 * 60 * 1000,
  });

  const options = useMemo(() => {
    const merged: DropdownOption[] = [];
    const seen = new Set<string>();

    for (const page of data?.pages ?? []) {
      for (const item of page.items) {
        if (!seen.has(item.id)) {
          seen.add(item.id);
          merged.push(item);
        }
      }
    }

    return merged;
  }, [data]);

  return {
    options,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage: hasNextPage ?? false,
    loadedPages: data?.pages.length ?? 0,
  };
}
