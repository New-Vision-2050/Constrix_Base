export const PERMIT_TO_DEPARTMENTS_NOTE_TYPES = [
  "permit_to_departments",
  "note_from_permit_to_departments",
  "from_permit_to_departments",
] as const;

export const DEPARTMENTS_TO_PERMIT_NOTE_TYPES = [
  "departments_to_permit",
  "note_from_departments_to_permit",
  "from_departments_to_permit",
] as const;

export type NoteLogTypeFilter =
  | typeof PERMIT_TO_DEPARTMENTS_NOTE_TYPES
  | typeof DEPARTMENTS_TO_PERMIT_NOTE_TYPES
  | readonly string[];

export function normalizeNoteLogTypes(
  noteTypes?: string | readonly string[],
): readonly string[] | undefined {
  if (!noteTypes) return undefined;
  return typeof noteTypes === "string" ? [noteTypes] : noteTypes;
}

export function matchesNoteLogType(
  logType: string | null | undefined,
  expectedTypes: readonly string[],
): boolean {
  if (!logType) return false;
  const normalized = logType.trim().toLowerCase();
  return expectedTypes.some((type) => type.toLowerCase() === normalized);
}
