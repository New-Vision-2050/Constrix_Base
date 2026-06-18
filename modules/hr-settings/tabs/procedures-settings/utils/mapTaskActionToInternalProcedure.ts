import type { CreateInternalProcedureArgs } from "@/services/api/hr-settings/internal-procedure-settings/types/args";
import type { InternalProcedure } from "@/services/api/hr-settings/internal-procedure-settings/types/response";
import type { TaskActionFormValues } from "../types";

/** Maps snake_case condition keys to API PascalCase (e.g. apply_to_all_branches → ApplyToAllBranches). */
export function toApiConditionKey(key: string): string {
  return key
    .split("_")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("");
}

/** Maps API PascalCase condition keys back to snake_case for form state. */
export function fromApiConditionKey(key: string): string {
  if (key.includes("_")) return key;
  return key
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^_/, "");
}

function mapTaskActionConditions(
  formConditions: TaskActionFormValues["formConditions"],
): CreateInternalProcedureArgs["conditions"] {
  return Object.entries(formConditions).map(([key, value]) => ({
    key: toApiConditionKey(key),
    value,
  }));
}

function buildInternalProcedurePayload(
  values: TaskActionFormValues,
  options: {
    procedureType: string;
    sortOrder: number;
    parentId?: string | null;
    isActive?: boolean;
  },
): CreateInternalProcedureArgs {
  return {
    name: values.name.trim(),
    type: options.procedureType,
    form: values.modelId,
    parent_id: options.parentId ?? null,
    conditions: mapTaskActionConditions(values.formConditions),
    appears_before_id: values.appearBefore.trim() || null,
    appears_after_id: values.appearAfter.trim() || null,
    sort_order: options.sortOrder,
    is_active: options.isActive ?? true,
  };
}

export function mapTaskActionToCreateInternalProcedure(
  values: TaskActionFormValues,
  options: {
    procedureType: string;
    sortOrder: number;
    parentId?: string | null;
  },
): CreateInternalProcedureArgs {
  return buildInternalProcedurePayload(values, options);
}

export function mapTaskActionToUpdateInternalProcedure(
  values: TaskActionFormValues,
  options: {
    procedureType: string;
    sortOrder: number;
    parentId?: string | null;
    isActive?: boolean;
  },
): CreateInternalProcedureArgs {
  return buildInternalProcedurePayload(values, options);
}

export function resolveProcedureSettingId(
  procedure: Pick<InternalProcedure, "id" | "parent_id">,
): string {
  return procedure.parent_id ?? procedure.id;
}

/** The first internal procedure (lowest sort_order child, or root if none). */
export function getPrimaryInternalProcedure(
  procedures: InternalProcedure[],
): InternalProcedure | null {
  if (!procedures.length) return null;

  const root = procedures.find((procedure) => !procedure.parent_id) ?? null;
  const children = root
    ? procedures.filter((procedure) => procedure.parent_id === root.id)
    : procedures.filter((procedure) => !!procedure.parent_id);

  if (children.length > 0) {
    return [...children].sort(
      (a, b) =>
        (a.sort_order ?? Number.MAX_SAFE_INTEGER) -
        (b.sort_order ?? Number.MAX_SAFE_INTEGER),
    )[0];
  }

  return root;
}

export function isPrimaryInternalProcedure(
  procedure: InternalProcedure,
  procedures: InternalProcedure[],
): boolean {
  const primary = getPrimaryInternalProcedure(procedures);
  return !!primary && primary.id === procedure.id;
}

export function getLastInternalProcedure(
  procedures: InternalProcedure[],
): InternalProcedure | null {
  if (!procedures.length) return null;

  const root = procedures.find((p) => !p.parent_id) ?? null;
  const children = root
    ? procedures.filter((p) => p.parent_id === root.id)
    : procedures.filter((p) => !!p.parent_id);

  if (children.length > 0) {
    return [...children].sort(
      (a, b) => (b.sort_order ?? 0) - (a.sort_order ?? 0),
    )[0];
  }

  return root;
}

export function isLastInternalProcedure(
  procedure: InternalProcedure,
  procedures: InternalProcedure[],
): boolean {
  const last = getLastInternalProcedure(procedures);
  return !!last && last.id === procedure.id;
}
