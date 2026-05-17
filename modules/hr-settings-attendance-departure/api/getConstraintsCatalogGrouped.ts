import { apiClient } from "@/config/axios-config";

export type ConstraintCatalogRow = {
  id: string;
  constraint_name: string;
  /** When API omits this, both accordions use the full catalog (same as job form selects). */
  is_additional?: boolean;
};

type ListResponse = {
  payload?: Record<string, unknown>[];
  pagination?: { last_page?: number };
};

export function readAdditionalFlag(row: Record<string, unknown>): boolean | undefined {
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

/** Maps API constraint / list rows into catalog rows (shared with employee constraint-locations). */
export function mapConstraintCatalogRow(
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
    const res = await apiClient.get<ListResponse>("/attendance/constraints/list", {
      params: { page, per_page: perPage },
    });

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
 * Loads attendance constraints from `/attendance/constraints/list`.
 * Splits into main vs additional when the payload exposes a discriminator; otherwise
 * returns the same list for both (matches dual selects in job professional data).
 */
export async function getConstraintsCatalogGrouped(): Promise<{
  main: ConstraintCatalogRow[];
  additional: ConstraintCatalogRow[];
}> {
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
