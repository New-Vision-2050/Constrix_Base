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
  name?: string;
};

/** Matches `/attendance/constraints?per_page=10&page=1` */
export const CONSTRAINTS_PER_PAGE = 10;

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
      ...(params.name ? { name: params.name } : {}),
    },
  });

  const payload = res.data.payload;
  return Array.isArray(payload) ? payload : [];
}

export type ConstraintsPageResult = {
  items: Constraint[];
  currentPage: number;
  lastPage: number;
  hasMore: boolean;
};

function parseConstraintsPagination(
  pagination: ResponseT["pagination"] | undefined,
  requestedPage: number,
  itemCount: number,
): Pick<ConstraintsPageResult, "currentPage" | "lastPage" | "hasMore"> {
  const currentPage = Number(pagination?.page ?? requestedPage) || requestedPage;
  const lastPageValue = pagination?.last_page;

  if (lastPageValue != null && !Number.isNaN(Number(lastPageValue))) {
    const lastPage = Number(lastPageValue);
    return {
      currentPage,
      lastPage,
      hasMore: requestedPage < lastPage,
    };
  }

  const hasMore = itemCount >= CONSTRAINTS_PER_PAGE;
  return {
    currentPage,
    lastPage: hasMore ? currentPage + 1 : currentPage,
    hasMore,
  };
}

export async function getConstraintsPage(
  page: number,
  name?: string,
): Promise<ConstraintsPageResult> {
  const res = await apiClient.get<ResponseT>("/attendance/constraints", {
    params: {
      per_page: CONSTRAINTS_PER_PAGE,
      page,
      ...(name ? { name } : {}),
    },
  });

  const items = Array.isArray(res.data.payload) ? res.data.payload : [];
  const pagination = parseConstraintsPagination(
    res.data.pagination,
    page,
    items.length,
  );

  return {
    items,
    ...pagination,
  };
}

/**
 * Loads every constraint for selects by paging with `per_page=10`.
 */
export async function getAllConstraintsForSelect(): Promise<Constraint[]> {
  const merged: Constraint[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const result = await getConstraintsPage(page);
    merged.push(...result.items);
    hasMore = result.hasMore;
    page += 1;
  }

  return merged;
}
