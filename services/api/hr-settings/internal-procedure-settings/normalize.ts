import type { InternalProcedure } from "./types/response";

function resolveOptionalId(value: unknown): string | null {
  if (value == null || value === "") return null;
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (typeof value === "object" && "id" in value) {
    const id = (value as { id?: unknown }).id;
    return id != null && String(id).length > 0 ? String(id) : null;
  }
  return null;
}

function resolveFormId(raw: Record<string, unknown>): string {
  const form = raw.form;
  if (typeof form === "string" && form.length > 0) return form;
  if (form && typeof form === "object") {
    const nested = form as Record<string, unknown>;
    if (typeof nested.key === "string" && nested.key.length > 0) {
      return nested.key;
    }
    if (nested.id != null && String(nested.id).length > 0) {
      return String(nested.id);
    }
  }
  if (raw.form_id != null && String(raw.form_id).length > 0) {
    return String(raw.form_id);
  }
  if (typeof raw.form_key === "string" && raw.form_key.length > 0) {
    return raw.form_key;
  }
  if (typeof raw.model === "string" && raw.model.length > 0) {
    return raw.model;
  }
  return "";
}

function extractInternalProcedurePayload(
  payload: Record<string, unknown>,
): Record<string, unknown> {
  const nested =
    payload.internal_procedure ??
    payload.internalProcedure ??
    payload.internal_procedures;

  if (nested && typeof nested === "object" && !Array.isArray(nested)) {
    const nestedRecord = nested as Record<string, unknown>;
    return {
      ...nestedRecord,
      id: payload.id ?? nestedRecord.id,
      name: payload.name ?? nestedRecord.name,
      type: payload.type ?? nestedRecord.type,
      parent_id: payload.parent_id ?? nestedRecord.parent_id,
    };
  }

  return payload;
}

export function normalizeInternalProcedure(
  raw: InternalProcedure | Record<string, unknown>,
): InternalProcedure {
  const data = extractInternalProcedurePayload(raw as Record<string, unknown>);

  return {
    id: String(data.id ?? ""),
    name: String(data.name ?? ""),
    type: String(data.type ?? ""),
    form: resolveFormId(data),
    parent_id: resolveOptionalId(data.parent_id),
    conditions: data.conditions as InternalProcedure["conditions"],
    appears_before_id: resolveOptionalId(
      data.appears_before_id ?? data.appears_before,
    ),
    appears_after_id: resolveOptionalId(
      data.appears_after_id ?? data.appears_after,
    ),
    sort_order:
      typeof data.sort_order === "number" ? data.sort_order : undefined,
    is_active:
      typeof data.is_active === "boolean" ? data.is_active : undefined,
  };
}
