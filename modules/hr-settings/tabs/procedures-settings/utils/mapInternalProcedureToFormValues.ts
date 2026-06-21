import type { InternalProcedure } from "@/services/api/hr-settings/internal-procedure-settings/types/response";
import { normalizeInternalProcedure } from "@/services/api/hr-settings/internal-procedure-settings/normalize";
import type { TaskActionFormValues } from "../types";
import { buildInitialConditionsFromDefinitions } from "./conditionFormUtils";

export function mapInternalProcedureToFormValues(
  procedure: InternalProcedure | Record<string, unknown>,
  definitions: Parameters<typeof buildInitialConditionsFromDefinitions>[0] = [],
): TaskActionFormValues {
  const normalized = normalizeInternalProcedure(procedure);

  return {
    name: normalized.name,
    modelId: normalized.form,
    conditions: buildInitialConditionsFromDefinitions(
      definitions,
      normalized.conditions,
    ),
    appearBeforeIds: normalized.appears_before_ids ?? [],
    appearAfterIds: normalized.appears_after_ids ?? [],
    isActive: normalized.is_active ?? true,
  };
}
