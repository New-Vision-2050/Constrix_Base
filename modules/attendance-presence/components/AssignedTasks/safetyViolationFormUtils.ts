export const MAX_VIOLATION_PHOTOS = 3;

export type SafetyViolationAnswerStatus =
  | "violation_found"
  | "no_violation"
  | "not_applicable";

export type ViolationActionOption = {
  key: string;
  label: string;
};

export const VIOLATION_ACTION_OPTIONS: ViolationActionOption[] = [
  { key: "work_cancellation", label: "إلغاء العمل" },
  { key: "work_stop", label: "إيقاف العمل" },
  { key: "equipment_exclusion", label: "استبعاد المعدة أو الموظ\u0641" },
];

export const VIOLATION_ACTION_LABEL_TO_KEY: Record<string, string> =
  Object.fromEntries(
    VIOLATION_ACTION_OPTIONS.map(({ label, key }) => [label, key]),
  );

export const VIOLATION_ACTION_KEY_TO_LABEL: Record<string, string> =
  Object.fromEntries(
    VIOLATION_ACTION_OPTIONS.map(({ label, key }) => [key, label]),
  );

const VIOLATION_ACTION_KEYS = new Set(Object.keys(VIOLATION_ACTION_KEY_TO_LABEL));

export type SafetyViolationPhotoPreview = {
  file: File;
  url: string;
};

export type SafetyViolationAnswer = {
  status: SafetyViolationAnswerStatus | null;
  photos: SafetyViolationPhotoPreview[];
};

export function createEmptySafetyViolationAnswer(): SafetyViolationAnswer {
  return {
    status: null,
    photos: [],
  };
}

export function normalizeViolationActionKey(action: string): string {
  const trimmed = action.trim();
  if (VIOLATION_ACTION_KEYS.has(trimmed)) return trimmed;
  return VIOLATION_ACTION_LABEL_TO_KEY[trimmed] ?? trimmed;
}

export function parseViolationActionOptions(
  actions: string[] | null | undefined,
): ViolationActionOption[] {
  if (!Array.isArray(actions) || actions.length === 0) {
    return VIOLATION_ACTION_OPTIONS;
  }

  const allowedKeys = new Set(
    actions
      .filter((action) => Boolean(action?.trim()))
      .map((action) => normalizeViolationActionKey(action.trim())),
  );

  const filtered = VIOLATION_ACTION_OPTIONS.filter((option) =>
    allowedKeys.has(option.key),
  );

  return filtered.length > 0 ? filtered : VIOLATION_ACTION_OPTIONS;
}

export function getViolationActionLabel(actionKey: string): string {
  return VIOLATION_ACTION_KEY_TO_LABEL[actionKey] ?? actionKey;
}

export function formatViolationActionsDisplay(
  actionOptions: ViolationActionOption[],
): string {
  if (!actionOptions.length) return "—";
  return actionOptions.map((option) => option.label).join("، ");
}

export function isSafetyViolationAnswerComplete(
  answer: SafetyViolationAnswer,
): boolean {
  if (!answer.status) return false;

  if (answer.status !== "violation_found") {
    return true;
  }

  return answer.photos.length > 0;
}

export function getFirstIncompleteViolationIndex(
  violationIds: string[],
  answers: Record<string, SafetyViolationAnswer>,
): number {
  const index = violationIds.findIndex((id) => {
    const answer = answers[id] ?? createEmptySafetyViolationAnswer();
    return !isSafetyViolationAnswerComplete(answer);
  });
  return index === -1 ? violationIds.length : index;
}

export function revokeSafetyViolationPhotos(
  photos: SafetyViolationPhotoPreview[],
): void {
  photos.forEach((photo) => URL.revokeObjectURL(photo.url));
}
