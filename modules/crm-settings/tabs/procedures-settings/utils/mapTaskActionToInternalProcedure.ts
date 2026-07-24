import type { CreateInternalProcedureArgs } from "@/services/api/hr-settings/internal-procedure-settings/types/args";
import type { InternalProcedure } from "@/services/api/hr-settings/internal-procedure-settings/types/response";
import { coerceBoolean } from "@/services/api/hr-settings/internal-procedure-settings/normalize";
import type { TaskActionFormValues } from "@/modules/hr-settings/tabs/procedures-settings/types";
import { mapConditionsToApiPayload } from "@/modules/hr-settings/tabs/procedures-settings/utils/conditionFormUtils";

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

export {
  getPrimaryInternalProcedure,
  getSortedChildInternalProcedures,
  isPrimaryInternalProcedure,
  getLastInternalProcedure,
  isLastInternalProcedure,
} from "@/modules/hr-settings/tabs/procedures-settings/utils/mapTaskActionToInternalProcedure";
