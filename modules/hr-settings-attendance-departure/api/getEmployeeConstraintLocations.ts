import { apiClient } from "@/config/axios-config";
import {
  mapConstraintCatalogRow,
  readAdditionalFlag,
  type ConstraintCatalogRow,
} from "@/modules/hr-settings-attendance-departure/api/getConstraintsCatalogGrouped";

type ApiEnvelope = {
  payload?: unknown;
  data?: unknown;
};

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

function normalizePayload(payload: unknown): {
  main: ConstraintCatalogRow[];
  additional: ConstraintCatalogRow[];
} {
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

/**
 * Employee constraint assignments/locations from:
 * GET /attendance/constraints/employees/{userId}/constraint-locations
 */
export async function getEmployeeConstraintLocationsGrouped(
  userId: string,
): Promise<{ main: ConstraintCatalogRow[]; additional: ConstraintCatalogRow[] }> {
  const trimmed = String(userId ?? "").trim();
  if (!trimmed) {
    return { main: [], additional: [] };
  }

  const res = await apiClient.get<ApiEnvelope>(
    `/attendance/constraints/employees/${encodeURIComponent(trimmed)}/constraint-locations`,
  );

  const payload = res.data?.payload ?? res.data?.data ?? res.data;
  return normalizePayload(payload);
}
