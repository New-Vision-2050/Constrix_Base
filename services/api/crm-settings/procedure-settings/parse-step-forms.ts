import type { ProcedureStep } from "./types/response";

/** API may return `forms` as a string or as boolean flags object. */
export function parseProcedureStepFormsKind(
  step: ProcedureStep,
): "approve" | "accept" | "financial" {
  const f = step.forms as unknown;
  if (typeof f === "string") {
    const s = f.toLowerCase().trim();
    if (s === "financial") return "financial";
    if (s === "accept") return "accept";
    if (s === "approve") return "approve";
    return "approve";
  }
  if (f && typeof f === "object" && !Array.isArray(f)) {
    const o = f as {
      approve?: boolean;
      accept?: boolean;
      financial?: boolean;
    };
    if (o.financial) return "financial";
    if (o.accept) return "accept";
    if (o.approve) return "approve";
  }
  return "approve";
}

/** ProceduresTable Select uses approval | accreditation | financial */
export function formsKindToProceduresTableUi(
  kind: "approve" | "accept" | "financial",
): string {
  if (kind === "financial") return "financial";
  if (kind === "accept") return "accreditation";
  return "approval";
}

/** StepCard Select uses approve | accept | financial */
export function formsKindToStepCardUi(
  kind: "approve" | "accept" | "financial",
): string {
  return kind;
}

/** API may return 0/1 for booleans */
export function coerceStepBoolean(v: unknown): boolean {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v !== 0;
  return Boolean(v);
}
