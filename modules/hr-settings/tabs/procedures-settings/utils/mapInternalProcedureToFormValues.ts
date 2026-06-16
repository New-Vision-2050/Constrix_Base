import type { InternalProcedure } from "@/services/api/hr-settings/internal-procedure-settings/types/response";
import type { TaskActionFormValues } from "../components/dialogs/AddTaskActionDialog";
import { fromApiConditionKey } from "./mapTaskActionToInternalProcedure";

function findConditionValue(
  conditions: Record<string, boolean | number>,
  optionKey: string,
): boolean | number | undefined {
  if (optionKey in conditions) return conditions[optionKey];

  const normalizedOptionKey = fromApiConditionKey(optionKey);
  const matchedEntry = Object.entries(conditions).find(([key]) => {
    const normalizedKey = fromApiConditionKey(key);
    return (
      key === optionKey ||
      normalizedKey === normalizedOptionKey ||
      normalizedKey === optionKey ||
      key === normalizedOptionKey
    );
  });

  return matchedEntry?.[1];
}

export function alignFormConditionsToOptionKeys(
  formConditions: Record<string, boolean | number>,
  optionKeys: string[],
): Record<string, boolean | number> {
  const aligned: Record<string, boolean | number> = {};

  optionKeys.forEach((optionKey) => {
    const value = findConditionValue(formConditions, optionKey);
    if (value !== undefined) {
      aligned[optionKey] = value;
    }
  });

  return aligned;
}

function normalizeProcedureConditionsToForm(
  conditions: InternalProcedure["conditions"],
): Record<string, boolean | number> {
  const formConditions: Record<string, boolean | number> = {};
  if (!conditions) return formConditions;

  if (Array.isArray(conditions)) {
    conditions.forEach((condition) => {
      formConditions[fromApiConditionKey(condition.key)] = condition.value;
    });
    return formConditions;
  }

  if (typeof conditions === "object") {
    Object.entries(conditions).forEach(([key, value]) => {
      if (typeof value === "boolean" || typeof value === "number") {
        formConditions[fromApiConditionKey(key)] = value;
      }
    });
  }

  return formConditions;
}

export function mapInternalProcedureToFormValues(
  procedure: InternalProcedure,
): TaskActionFormValues {
  return {
    name: procedure.name,
    modelId: procedure.form,
    formConditions: normalizeProcedureConditionsToForm(procedure.conditions),
    appearBefore: procedure.appears_before_id ?? "",
    appearAfter: procedure.appears_after_id ?? "",
  };
}
