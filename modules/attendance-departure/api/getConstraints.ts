import { apiClient } from "@/config/axios-config";

export interface Constraint {
  id: string;
  constraint_name: string;
}

type ResponseT = {
  code: string;
  message: string;
  payload: Constraint[];
  pagination?: {
    last_page?: number;
    page?: number;
  };
};

type GetConstraintsParams = {
  page?: number;
  per_page?: number;
};

/** Matches `/attendance/constraints?per_page=10&page=1` */
export const CONSTRAINTS_PER_PAGE = 1000;

/**
 * Single page: GET `/attendance/constraints?per_page={n}&page={n}`
 */
export default async function getConstraints(
  params: GetConstraintsParams = {
    page: 1,
    per_page: CONSTRAINTS_PER_PAGE,
  },
) {
  const res = await apiClient.get<ResponseT>("/attendance/constraints", {
    params: {
      per_page: params.per_page ?? CONSTRAINTS_PER_PAGE,
      page: params.page ?? 1,
    },
  });

  const payload = res.data.payload;
  return Array.isArray(payload) ? payload : [];
}

/**
 * Loads every constraint for selects by paging with `per_page=10`.
 */
export async function getAllConstraintsForSelect(): Promise<Constraint[]> {
  const merged: Constraint[] = [];
  let page = 1;
  let lastPage = 1;

  do {
    const res = await apiClient.get<ResponseT>("/attendance/constraints", {
      params: {
        per_page: CONSTRAINTS_PER_PAGE,
        page,
      },
    });

    const payload = Array.isArray(res.data.payload) ? res.data.payload : [];
    merged.push(...payload);
    lastPage = res.data.pagination?.last_page ?? 1;
    page += 1;
  } while (page <= lastPage);

  return merged;
}
