import type { CreateInternalProcedureArgs } from "@/services/api/hr-settings/internal-procedure-settings/types/args";
import type { InternalProcedure } from "@/services/api/hr-settings/internal-procedure-settings/types/response";
import { coerceBoolean } from "@/services/api/hr-settings/internal-procedure-settings/normalize";
import type { TaskActionFormValues } from "../types";
import { mapConditionsToApiPayload } from "./conditionFormUtils";

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
    conditions: mapConditionsToApiPayload(values.conditions),
    appears_before_ids: values.appearBeforeIds.filter(Boolean),
    appears_after_ids: values.appearAfterIds.filter(Boolean),
    sort_order: options.sortOrder,
    is_active: coerceBoolean(values.isActive ?? options.isActive, true),
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

function sameProcedureId(
  left: Pick<InternalProcedure, "id">,
  right: Pick<InternalProcedure, "id">,
): boolean {
  return String(left.id) === String(right.id);
}

/** Ordered internal_procedure items (children by sort_order, or root when alone). */
export function getSortedChildInternalProcedures(
  procedures: InternalProcedure[],
): InternalProcedure[] {
  if (!procedures.length) return [];

  const root = procedures.find((procedure) => !procedure.parent_id) ?? null;
  const children = root
    ? procedures.filter((procedure) =>
        sameProcedureId(
          { id: procedure.parent_id ?? "" },
          { id: root.id },
        ),
      )
    : procedures.filter((procedure) => !!procedure.parent_id);

  const list = children.length > 0 ? children : root ? [root] : [];

  return [...list]
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const orderA = a.item.sort_order ?? a.index + 1;
      const orderB = b.item.sort_order ?? b.index + 1;
      if (orderA !== orderB) return orderA - orderB;
      return a.index - b.index;
    })
    .map(({ item }) => item);
}

/** The first internal procedure in the ordered list. */
export function getPrimaryInternalProcedure(
  procedures: InternalProcedure[],
): InternalProcedure | null {
  const sorted = getSortedChildInternalProcedures(procedures);
  return sorted[0] ?? null;
}

export function isPrimaryInternalProcedure(
  procedure: InternalProcedure,
  procedures: InternalProcedure[],
): boolean {
  const primary = getPrimaryInternalProcedure(procedures);
  return !!primary && sameProcedureId(primary, procedure);
}

export function getLastInternalProcedure(
  procedures: InternalProcedure[],
): InternalProcedure | null {
  const sorted = getSortedChildInternalProcedures(procedures);
  return sorted[sorted.length - 1] ?? null;
}

export function isLastInternalProcedure(
  procedure: InternalProcedure,
  procedures: InternalProcedure[],
): boolean {
  const last = getLastInternalProcedure(procedures);
  return !!last && sameProcedureId(last, procedure);
}
