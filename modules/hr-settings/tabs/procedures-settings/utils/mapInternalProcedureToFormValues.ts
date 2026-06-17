import type { InternalProcedure } from "@/services/api/hr-settings/internal-procedure-settings/types/response";
import { normalizeInternalProcedure } from "@/services/api/hr-settings/internal-procedure-settings/normalize";
import type { TaskActionFormValues } from "../types";
import { fromApiConditionKey } from "./mapTaskActionToInternalProcedure";

function coerceConditionValue(value: unknown): boolean | number | undefined {
  if (typeof value === "boolean" || typeof value === "number") return value;
  if (typeof value === "string") {
    if (value === "true") return true;
    if (value === "false") return false;
    const parsed = parseInt(value, 10);
    if (!Number.isNaN(parsed) && String(parsed) === value.trim()) {
      return parsed;
    }
  }
  return undefined;
}

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
      const coerced = coerceConditionValue(condition.value);
      if (coerced !== undefined) {
        formConditions[fromApiConditionKey(condition.key)] = coerced;
      }
    });
    return formConditions;
  }

  if (typeof conditions === "object") {
    Object.entries(conditions).forEach(([key, value]) => {
      const coerced = coerceConditionValue(value);
      if (coerced !== undefined) {
        formConditions[fromApiConditionKey(key)] = coerced;
      }
    });
  }

  return formConditions;
}

export function mapInternalProcedureToFormValues(
  procedure: InternalProcedure | Record<string, unknown>,
): TaskActionFormValues {
  const normalized = normalizeInternalProcedure(procedure);

  return {
    name: normalized.name,
    modelId: normalized.form,
    formConditions: normalizeProcedureConditionsToForm(normalized.conditions),
    appearBefore: normalized.appears_before_id ?? "",
    appearAfter: normalized.appears_after_id ?? "",
  };
}
