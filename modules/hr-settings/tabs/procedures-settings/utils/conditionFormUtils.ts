import type { RichInternalProcedureCondition } from "@/services/api/hr-settings/internal-procedure-settings/types/args";
import { coerceBoolean } from "@/services/api/hr-settings/internal-procedure-settings/normalize";
import type {
  FormConditionOption,
  InternalProcedureConditions,
} from "@/services/api/hr-settings/internal-procedure-settings/types/response";
import type { TaskActionConditionFormValue } from "../types";

function normalizeConditionKey(key: string): string {
  if (key.includes("_")) return key;
  return key
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^_/, "");
}

function isRichConditionArray(
  conditions: unknown[],
): conditions is RichInternalProcedureCondition[] {
  return conditions.some(
    (item) =>
      item != null &&
      typeof item === "object" &&
      "is_active" in item &&
      "sort_order" in item,
  );
}

function buildDefaultSettings(
  schema: FormConditionOption["settingsSchema"],
): Record<string, string | number | boolean> {
  const settings: Record<string, string | number | boolean> = {};
  schema.forEach((field) => {
    if (field.default !== undefined) {
      settings[field.key] = field.default;
    } else if (field.type === "int") {
      settings[field.key] = 0;
    } else if (field.type === "time") {
      settings[field.key] = "08:00";
    } else if (field.type === "bool") {
      settings[field.key] = false;
    } else if (field.type === "select") {
      settings[field.key] =
        field.default ?? field.options?.[0]?.value ?? "";
    } else {
      settings[field.key] = "";
    }
  });
  return settings;
}

function findStoredRichCondition(
  stored: RichInternalProcedureCondition[],
  definitionKey: string,
): RichInternalProcedureCondition | undefined {
  const normalizedKey = normalizeConditionKey(definitionKey);
  return stored.find(
    (item) => normalizeConditionKey(item.key) === normalizedKey,
  );
}

function findLegacyStoredValue(
  stored: InternalProcedureConditions,
  definitionKey: string,
): boolean | number | undefined {
  const normalizedKey = normalizeConditionKey(definitionKey);

  if (Array.isArray(stored)) {
    if (isRichConditionArray(stored)) return undefined;
    const match = stored.find(
      (item) => normalizeConditionKey(item.key) === normalizedKey,
    );
    return match?.value;
  }

  if (stored && typeof stored === "object") {
    for (const [key, value] of Object.entries(stored)) {
      if (normalizeConditionKey(key) === normalizedKey) {
        if (typeof value === "boolean" || typeof value === "number") {
          return value;
        }
      }
    }
  }

  return undefined;
}

function mapLegacyValueToFormRow(
  definition: FormConditionOption,
  legacyValue: boolean | number | undefined,
  sortOrder: number,
): TaskActionConditionFormValue {
  const settings = buildDefaultSettings(definition.settingsSchema);

  if (typeof legacyValue === "number") {
    const intField = definition.settingsSchema.find(
      (field) => field.type === "int",
    );
    if (intField) {
      settings[intField.key] = legacyValue;
    }
    return {
      key: definition.key,
      isActive: true,
      sortOrder,
      settings,
    };
  }

  if (typeof legacyValue === "boolean") {
    return {
      key: definition.key,
      isActive: legacyValue,
      sortOrder,
      settings,
    };
  }

  return {
    key: definition.key,
    isActive: false,
    sortOrder,
    settings,
  };
}

export function buildInitialConditionsFromDefinitions(
  definitions: FormConditionOption[],
  stored?: InternalProcedureConditions,
): TaskActionConditionFormValue[] {
  const richStored =
    Array.isArray(stored) && isRichConditionArray(stored) ? stored : [];

  return definitions.map((definition, index) => {
    const sortOrder = index + 1;
    const richMatch = findStoredRichCondition(richStored, definition.key);

    if (richMatch) {
      return {
        key: definition.key,
        isActive: coerceBoolean(richMatch.is_active, false),
        sortOrder: richMatch.sort_order ?? sortOrder,
        settings: {
          ...buildDefaultSettings(definition.settingsSchema),
          ...(richMatch.settings ?? {}),
        },
      };
    }

    const legacyValue = stored
      ? findLegacyStoredValue(stored, definition.key)
      : undefined;

    return mapLegacyValueToFormRow(definition, legacyValue, sortOrder);
  });
}

export function mapConditionsToApiPayload(
  conditions: TaskActionConditionFormValue[],
): RichInternalProcedureCondition[] {
  return [...conditions]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((condition, index) => ({
      key: condition.key,
      is_active: coerceBoolean(condition.isActive, false),
      sort_order: index + 1,
      settings: condition.settings,
    }));
}

export function mergeConditionsWithDefinitions(
  current: TaskActionConditionFormValue[],
  definitions: FormConditionOption[],
): TaskActionConditionFormValue[] {
  const currentByKey = new Map(
    current.map((condition) => [normalizeConditionKey(condition.key), condition]),
  );

  return definitions.map((definition, index) => {
    const existing = currentByKey.get(normalizeConditionKey(definition.key));
    if (existing) {
      return {
        ...existing,
        key: definition.key,
        settings: {
          ...buildDefaultSettings(definition.settingsSchema),
          ...existing.settings,
        },
      };
    }

    return mapLegacyValueToFormRow(definition, undefined, index + 1);
  });
}
