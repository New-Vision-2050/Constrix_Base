import type { EditablePermitField } from "./EditablePermitCell";
import type { WorkOrderRow } from "./types";

export type DrillingValidationErrorKey =
  | "achievedDrillingExceedsTarget"
  | "achievedExtentionExceedsTarget";

const DRILLING_RELATED_FIELDS = new Set<EditablePermitField>([
  "targetDrilling",
  "achievedDrilling",
  "targetExtention",
  "achievedExtention",
]);

function parseOptionalNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  return Number.isNaN(num) ? null : num;
}

export function getDrillingValidationErrorKey(
  field: EditablePermitField,
  value: string,
  row: WorkOrderRow,
): DrillingValidationErrorKey | null {
  if (!DRILLING_RELATED_FIELDS.has(field)) return null;

  let targetDrilling = parseOptionalNumber(row.targetDrilling);
  let achievedDrilling = parseOptionalNumber(row.achievedDrilling);
  let targetExtention = parseOptionalNumber(row.targetExtention);
  let achievedExtention = parseOptionalNumber(row.achievedExtention);

  switch (field) {
    case "targetDrilling":
      targetDrilling = parseOptionalNumber(value);
      break;
    case "achievedDrilling":
      achievedDrilling = parseOptionalNumber(value);
      break;
    case "targetExtention":
      targetExtention = parseOptionalNumber(value);
      break;
    case "achievedExtention":
      achievedExtention = parseOptionalNumber(value);
      break;
  }

  if (
    (field === "targetDrilling" || field === "achievedDrilling") &&
    targetDrilling != null &&
    achievedDrilling != null &&
    achievedDrilling > targetDrilling
  ) {
    return "achievedDrillingExceedsTarget";
  }

  if (
    (field === "targetExtention" || field === "achievedExtention") &&
    targetExtention != null &&
    achievedExtention != null &&
    achievedExtention > targetExtention
  ) {
    return "achievedExtentionExceedsTarget";
  }

  return null;
}
