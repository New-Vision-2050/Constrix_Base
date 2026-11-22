"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getBranchOptions,
  getManagementOptions,
  getProjectOptions,
  searchEmployees,
} from "../api/lookups";
import { forumKeys } from "../query-keys";

/** Debounces a value so pickers do not fire a request per keystroke. */
export function useDebounced<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export function useEmployeeSearch(params: {
  search?: string;
  branch_id?: string;
  project_id?: string;
  enabled?: boolean;
}) {
  const { enabled = true, ...rest } = params;
  return useQuery({
    queryKey: forumKeys.employees(rest),
    queryFn: () => searchEmployees(rest),
    enabled,
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000,
  });
}

export function useBranchOptions(enabled = true) {
  return useQuery({
    queryKey: forumKeys.branches,
    queryFn: getBranchOptions,
    enabled,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useManagementOptions(branchId?: string, enabled = true) {
  return useQuery({
    queryKey: forumKeys.managements(branchId),
    queryFn: () => getManagementOptions(branchId),
    enabled,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProjectOptions(enabled = true) {
  return useQuery({
    queryKey: forumKeys.projects,
    queryFn: getProjectOptions,
    enabled,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
}
