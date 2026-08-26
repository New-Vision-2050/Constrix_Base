import type { UpdateProjectOrderPermitArgs } from "@/services/api/projects/project-order-permits/types/params";
import type { WorkOrderColumnKey } from "./types";

export const NOTE_FROM_PERMIT_COLUMN: WorkOrderColumnKey =
  "noteFromPermitToDepartments";

export const NOTE_FROM_DEPARTMENTS_COLUMN: WorkOrderColumnKey =
  "noteFromDepartmentsToPermit";

export function isNoteFieldBody(body: UpdateProjectOrderPermitArgs): boolean {
  return (
    body.note_from_permit_to_departments !== undefined ||
    body.note_from_departments_to_permit !== undefined
  );
}

export function canEditNoteFromPermit(isEditable: boolean): boolean {
  return isEditable;
}

export function canEditNoteFromDepartments(isProjectEditable: boolean): boolean {
  return isProjectEditable;
}
