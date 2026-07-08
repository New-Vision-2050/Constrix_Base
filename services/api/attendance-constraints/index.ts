import { baseApi } from "@/config/axios/instances/base";
import type {
  AssignConstraintEmployeeParams,
  AssignConstraintShiftsBody,
  BulkCreateConstraintLocationsBody,
  ConstraintLocationCreateItem,
  GetConstraintEmployeesParams,
  GetConstraintLocationsParams,
  PatchConstraintBasicInfoParams,
  PatchConstraintNotificationsParams,
  PatchConstraintRulesParams,
} from "./types/params";
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

type ConstraintLocationsApiEnvelope = {
  payload?: unknown;
  data?: unknown;
};

function readAdditionalFlag(row: Record<string, unknown>): boolean | undefined {
  const raw =
    row.is_additional ??
    row.is_additional_constraint ??
    row.additional_constraint ??
    row.for_additional;

  if (raw === true || raw === 1 || raw === "1") return true;
  if (raw === false || raw === 0 || raw === "0") return false;

  const assignment = row.assignment_type ?? row.constraint_assignment;
  if (typeof assignment === "string") {
    const a = assignment.toLowerCase();
    if (a === "additional" || a === "secondary" || a === "sub") return true;
    if (a === "main" || a === "primary") return false;
  }

  return undefined;
}

function mapConstraintCatalogRow(
  row: Record<string, unknown>,
): ConstraintCatalogRow | null {
  const id =
    row.id != null
      ? String(row.id)
      : row.constraint_id != null
        ? String(row.constraint_id)
        : "";
  const constraint_name = String(
    row.constraint_name ?? row.name ?? "",
  ).trim();
  if (!id || !constraint_name) return null;

  const flag = readAdditionalFlag(row);
  return {
    id,
    constraint_name,
    ...(flag !== undefined ? { is_additional: flag } : {}),
  };
}

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

/**
 * Loads `/attendance/constraints/list` grouped into main vs additional when the payload
 * exposes a discriminator; otherwise returns the same list for both.
 */
async function loadConstraintsCatalogGrouped(): Promise<GroupedConstraintsLocations> {
  const rows = await fetchAllConstraintListRows();
  const hasDiscriminator = rows.some((r) => r.is_additional !== undefined);
  if (!hasDiscriminator) {
    return { main: rows, additional: rows };
  }
  return {
    main: rows.filter((r) => r.is_additional !== true),
    additional: rows.filter((r) => r.is_additional === true),
  };
}

const MAIN_KEYS = [
  "main",
  "main_constraints",
  "primary_constraints",
  "constraints_main",
  "main_constraint_locations",
];

const ADDITIONAL_KEYS = [
  "additional",
  "additional_constraints",
  "sub",
  "secondary_constraints",
  "constraints_additional",
  "additional_constraint_locations",
  "additional_locations",
];

function rowsFromArray(items: unknown[]): ConstraintCatalogRow[] {
  const out: ConstraintCatalogRow[] = [];
  for (const item of items) {
    if (!item || typeof item !== "object") continue;
    const rec = item as Record<string, unknown>;

    let mapped = mapConstraintCatalogRow(rec);
    if (!mapped) {
      const nestedKeys = [
        "constraint",
        "constraint_info",
        "constraint_data",
        "attendance_constraint",
      ] as const;
      for (const k of nestedKeys) {
        const n = rec[k];
        if (n && typeof n === "object") {
          mapped = mapConstraintCatalogRow(n as Record<string, unknown>);
          if (mapped) break;
        }
      }
    }

    if (!mapped && (rec.constraint_id != null || rec.constraint_name != null)) {
      mapped = mapConstraintCatalogRow(rec);
    }

    if (mapped) {
      const parentFlag = readAdditionalFlag(rec);
      if (parentFlag !== undefined) {
        mapped = { ...mapped, is_additional: parentFlag };
      }
      out.push(mapped);
    }
  }
  return out;
}

function tryKeyedArrays(
  obj: Record<string, unknown>,
): { main: ConstraintCatalogRow[]; additional: ConstraintCatalogRow[] } {
  let main: ConstraintCatalogRow[] = [];
  let additional: ConstraintCatalogRow[] = [];

  for (const k of MAIN_KEYS) {
    const v = obj[k];
    if (Array.isArray(v)) {
      main = rowsFromArray(v);
      break;
    }
  }
  if (
    main.length === 0 &&
    Array.isArray(obj.branch_locations)
  ) {
    main = rowsFromArray(obj.branch_locations as unknown[]);
  }
  for (const k of ADDITIONAL_KEYS) {
    const v = obj[k];
    if (Array.isArray(v)) {
      additional = rowsFromArray(v);
      break;
    }
  }

  return { main, additional };
}

function splitFlat(rows: ConstraintCatalogRow[]): {
  main: ConstraintCatalogRow[];
  additional: ConstraintCatalogRow[];
} {
  const hasDiscriminator = rows.some((r) => r.is_additional !== undefined);
  if (!hasDiscriminator) {
    return { main: rows, additional: rows };
  }
  return {
    main: rows.filter((r) => r.is_additional !== true),
    additional: rows.filter((r) => r.is_additional === true),
  };
}

/**
 * GET .../employees/{userId}/constraint-locations sometimes returns one object:
 * `main_constraint`, `additional_constraints`, `branch_locations`,
 * `additional_locations`, plus root fields.
 */
function normalizeEmployeeConstraintAssignmentObject(
  obj: Record<string, unknown>,
): GroupedConstraintsLocations | null {
  const hasShape =
    obj.main_constraint != null ||
    Array.isArray(obj.branch_locations) ||
    Array.isArray(obj.additional_locations) ||
    Array.isArray(obj.additional_constraints);

  if (!hasShape) {
    return null;
  }

  const mainById = new Map<string, ConstraintCatalogRow>();
  const addMain = (row: ConstraintCatalogRow | null) => {
    if (row?.id && row.constraint_name) {
      mainById.set(row.id, row);
    }
  };

  const mcRaw = obj.main_constraint;
  if (mcRaw && typeof mcRaw === "object") {
    const mc = mcRaw as Record<string, unknown>;
    let mapped = mapConstraintCatalogRow(mc);
    if (
      !mapped &&
      mc.id != null &&
      (String(mc.constraint_name ?? mc.name ?? "").trim() ||
        String(obj.constraint_name ?? obj.name ?? "").trim())
    ) {
      mapped = {
        id: String(mc.id),
        constraint_name: String(
          mc.constraint_name ??
            mc.name ??
            obj.constraint_name ??
            obj.name ??
            "",
        ).trim(),
      };
    }
    addMain(mapped);
  }

  if (Array.isArray(obj.branch_locations)) {
    for (const raw of obj.branch_locations) {
      if (!raw || typeof raw !== "object") continue;
      const rec = raw as Record<string, unknown>;
      const id =
        rec.id != null
          ? String(rec.id)
          : rec.branch_id != null
            ? String(rec.branch_id)
            : "";
      const constraint_name = String(
        rec.name ?? rec.constraint_name ?? "",
      ).trim();
      if (!id || !constraint_name) continue;
      mainById.set(id, {
        id,
        constraint_name,
      });
    }
  }

  if (
    mainById.size === 0 &&
    (obj.constraint_name != null || obj.name != null) &&
    obj.id != null
  ) {
    const id = String(obj.id);
    const constraint_name = String(
      obj.constraint_name ?? obj.name ?? "",
    ).trim();
    if (id && constraint_name) {
      mainById.set(id, { id, constraint_name });
    }
  }

  const additionalFromLocations = Array.isArray(obj.additional_locations)
    ? rowsFromArray(obj.additional_locations as unknown[])
    : [];

  const additionalFromRoot = Array.isArray(obj.additional_constraints)
    ? rowsFromArray(obj.additional_constraints as unknown[])
    : [];

  let additionalMerged = [
    ...additionalFromLocations,
    ...additionalFromRoot,
  ];

  if (mcRaw && typeof mcRaw === "object") {
    const nested = (mcRaw as Record<string, unknown>).additional_constraints;
    if (Array.isArray(nested)) {
      additionalMerged = [
        ...additionalMerged,
        ...rowsFromArray(nested as unknown[]),
      ];
    }
  }

  const dedupeAdditional = new Map<string, ConstraintCatalogRow>();
  for (const r of additionalMerged) {
    if (r.id && r.constraint_name) {
      dedupeAdditional.set(r.id, r);
    }
  }

  return {
    main: [...mainById.values()],
    additional: [...dedupeAdditional.values()],
  };
}

function normalizeEmployeeConstraintPayload(
  payload: unknown,
): GroupedConstraintsLocations {
  if (payload == null) {
    return { main: [], additional: [] };
  }

  if (Array.isArray(payload)) {
    return splitFlat(rowsFromArray(payload));
  }

  if (typeof payload !== "object") {
    return { main: [], additional: [] };
  }

  const obj = payload as Record<string, unknown>;

  const assignmentShape = normalizeEmployeeConstraintAssignmentObject(obj);
  if (
    assignmentShape &&
    (assignmentShape.main.length > 0 || assignmentShape.additional.length > 0)
  ) {
    if (assignmentShape.additional.length === 0) {
      const keyedAdditional = tryKeyedArrays(obj).additional;
      if (keyedAdditional.length > 0) {
        return { ...assignmentShape, additional: keyedAdditional };
      }
    }
    return assignmentShape;
  }

  const keyed = tryKeyedArrays(obj);
  if (keyed.main.length > 0 || keyed.additional.length > 0) {
    return keyed;
  }

  const nestedArrays = [
    obj.locations,
    obj.constraint_locations,
    obj.items,
    obj.data,
    obj.constraints,
  ];

  for (const candidate of nestedArrays) {
    if (Array.isArray(candidate)) {
      return splitFlat(rowsFromArray(candidate));
    }
    if (candidate && typeof candidate === "object") {
      const inner = tryKeyedArrays(candidate as Record<string, unknown>);
      if (inner.main.length > 0 || inner.additional.length > 0) {
        return inner;
      }
    }
  }

  return { main: [], additional: [] };
}

export const AttendanceConstraintsApi = {
  getCatalogGrouped: () => loadConstraintsCatalogGrouped(),

  getEmployeeConstraintLocationsGrouped: async (
    userId: string,
  ): Promise<GroupedConstraintsLocations> => {
    const trimmed = String(userId ?? "").trim();
    if (!trimmed) {
      return { main: [], additional: [] };
    }

    const res = await baseApi.get<ConstraintLocationsApiEnvelope>(
      `/attendance/constraints/employees/${encodeURIComponent(trimmed)}/constraint-locations`,
    );

    const payload = res.data?.payload ?? res.data?.data ?? res.data;
    return normalizeEmployeeConstraintPayload(payload);
  },

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

  getBasicInfo: (constraintId: string) =>
    baseApi.get(`attendance/constraints/${constraintId}/basic-info`),
  
  patchBasicInfo: (constraintId: string, params: PatchConstraintBasicInfoParams) =>
    baseApi.patch(
      `attendance/constraints/${constraintId}/basic-info`,
      params,
    ),

  getEmployees: (
    constraintId: string,
    params?: GetConstraintEmployeesParams,
  ) =>
    baseApi.get(
      `attendance/constraints/${constraintId}/employees`,
      { params },
    ),

  assignEmployee: (
    constraintId: string,
    body: AssignConstraintEmployeeParams,
  ) =>
    baseApi.post(`attendance/constraints/${constraintId}/employees`, body),

  getLocations: (
    constraintId: string,
    params?: GetConstraintLocationsParams,
  ) =>
    baseApi.get(
      `attendance/constraints/${constraintId}/locations`,
      { params },
    ),

  createLocations: (
    constraintId: string,
    body: BulkCreateConstraintLocationsBody,
  ) =>
    baseApi.post(
      `attendance/constraints/${constraintId}/locations`,
      body,
    ),

  updateLocation: (
    constraintId: string,
    locationId: string,
    body: ConstraintLocationCreateItem,
  ) =>
    baseApi.put(
      `attendance/constraints/${constraintId}/locations/${locationId}`,
      body,
    ),

  deleteLocation: (constraintId: string, locationId: string) =>
    baseApi.delete(
      `attendance/constraints/${constraintId}/locations/${locationId}`,
    ),

  getShifts: (constraintId: string) =>
    baseApi.get(`attendance/constraints/${constraintId}/shifts`),

  assignShifts: (
    constraintId: string,
    body: AssignConstraintShiftsBody,
  ) =>
    baseApi.post(`attendance/constraints/${constraintId}/shifts`, body),

  getRules: (constraintId: string) =>
    baseApi.get(`attendance/constraints/${constraintId}/rules`),

  patchRules: (constraintId: string, body: PatchConstraintRulesParams) =>
    baseApi.patch(`attendance/constraints/${constraintId}/rules`, body),

  getNotifications: (constraintId: string) =>
    baseApi.get(`attendance/constraints/${constraintId}/notifications`),

  patchNotifications: (
    constraintId: string,
    body: PatchConstraintNotificationsParams,
  ) =>
    baseApi.patch(
      `attendance/constraints/${constraintId}/notifications`,
      body,
    ),
};

/** Alias preferred by determinant settings tabs (aligned with naming before `AttendanceConstraintsApi`). */
export const AttendanceConstraints = AttendanceConstraintsApi;

export type {
  AssignConstraintEmployeeParams,
  AssignConstraintShiftsBody,
  AssignConstraintShiftsDailyBody,
  AssignConstraintShiftsWeeklyBody,
  BulkCreateConstraintLocationsBody,
  ConstraintLocationCreateItem,
  ConstraintShiftDailyDayBlock,
  ConstraintShiftPeriodItem,
  ConstraintShiftWeekday,
  GetConstraintEmployeesParams,
  GetConstraintLocationsParams,
  PatchConstraintBasicInfoParams,
  PatchConstraintNotificationsParams,
  PatchConstraintRulesParams,
} from "./types/params";

export type {
  ConstraintBasicInfo,
  ConstraintCatalogRow,
  ConstraintEmployeesListApiResponse,
  ConstraintEmployeesListNormalized,
  ConstraintLocationPayload,
  ConstraintLocationsListApiResponse,
  ConstraintNotifications,
  ConstraintNotificationsApiResponse,
  ConstraintRules,
  ConstraintRulesApiResponse,
  ConstraintSelectedEmployeePayload,
  GroupedConstraintsLocations,
} from "./types/response";

export type {
  AssignConstraintReplacementsBody,
  EmployeeConstraintReplacement,
} from "./types/request";
