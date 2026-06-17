import type { CreateInternalProcedureArgs } from "@/services/api/hr-settings/internal-procedure-settings/types/args";
import type { InternalProcedure } from "@/services/api/hr-settings/internal-procedure-settings/types/response";
import type { TaskActionFormValues } from "@/modules/hr-settings/tabs/procedures-settings/components/dialogs/AddTaskActionDialog";

/** Maps snake_case condition keys to API PascalCase (e.g. apply_to_all_branches → ApplyToAllBranches). */
export function toApiConditionKey(key: string): string {
  return key
    .split("_")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("");
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

export {
  getPrimaryInternalProcedure,
  isPrimaryInternalProcedure,
} from "@/modules/hr-settings/tabs/procedures-settings/utils/mapTaskActionToInternalProcedure";
