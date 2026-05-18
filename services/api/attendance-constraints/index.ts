import { baseApi } from "@/config/axios/instances/base";
import { mapConstraintCatalogRow } from "./catalogMappers";
import { normalizeEmployeeConstraintLocationsPayload } from "./normalizeEmployeeConstraintLocations";
import type {
  AssignConstraintReplacementsBody,
  EmployeeConstraintReplacement,
} from "./types/request";
import type {
  ConstraintCatalogRow,
  GroupedConstraintsLocations,
} from "./types/response";

type ConstraintsListEnvelope = {
  payload?: Record<string, unknown>[];
  pagination?: { last_page?: number };
};

type ApiEnvelope = {
  payload?: unknown;
  data?: unknown;
};

async function fetchAllConstraintListRows(): Promise<ConstraintCatalogRow[]> {
  const perPage = 100;
  let page = 1;
  const merged: ConstraintCatalogRow[] = [];
  let lastPage = 1;

  do {
    const res = await baseApi.get<ConstraintsListEnvelope>(
      "/attendance/constraints/list",
      {
        params: { page, per_page: perPage },
      },
    );

    const payload = Array.isArray(res.data.payload) ? res.data.payload : [];
    for (const raw of payload) {
      const mapped = mapConstraintCatalogRow(raw as Record<string, unknown>);
      if (mapped) merged.push(mapped);
    }

    lastPage = res.data.pagination?.last_page ?? 1;
    page += 1;
  } while (page <= lastPage && page <= 100);

  return merged;
}

export const AttendanceConstraintsApi = {
  /** Paginated `/attendance/constraints/list`, split main vs additional when discriminated */
  getCatalogGrouped: async (): Promise<GroupedConstraintsLocations> => {
    const rows = await fetchAllConstraintListRows();

    const hasDiscriminator = rows.some((r) => r.is_additional !== undefined);
    if (!hasDiscriminator) {
      return { main: rows, additional: rows };
    }

    return {
      main: rows.filter((r) => r.is_additional !== true),
      additional: rows.filter((r) => r.is_additional === true),
    };
  },

  /** GET `/attendance/constraints/employees/{userId}/constraint-locations` */
  getEmployeeConstraintLocationsGrouped: async (
    userId: string,
  ): Promise<GroupedConstraintsLocations> => {
    const trimmed = String(userId ?? "").trim();
    if (!trimmed) {
      return { main: [], additional: [] };
    }

    const res = await baseApi.get<ApiEnvelope>(
      `/attendance/constraints/employees/${encodeURIComponent(trimmed)}/constraint-locations`,
    );

    const payload = res.data?.payload ?? res.data?.data ?? res.data;
    return normalizeEmployeeConstraintLocationsPayload(payload);
  },

  /** PUT `/attendance/constraints/employees/{userId}/assign-constraint` */
  assignReplacements: async (
    userId: string,
    replacements: EmployeeConstraintReplacement[],
  ): Promise<unknown> => {
    const trimmed = String(userId ?? "").trim();
    const body: AssignConstraintReplacementsBody = { replacements };
    const res = await baseApi.put(
      `/attendance/constraints/employees/${encodeURIComponent(trimmed)}/assign-constraint`,
      body,
    );
    return res.data;
  },
};

export type {
  AssignConstraintReplacementsBody,
  EmployeeConstraintReplacement,
} from "./types/request";

export type {
  ConstraintCatalogRow,
  GroupedConstraintsLocations,
} from "./types/response";
