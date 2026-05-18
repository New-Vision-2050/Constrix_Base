import type { ConstraintCatalogRow } from "./types/response";

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
