import type { ChipTone } from "../components/ui/StatusChip";
import type {
  AnnouncementStatus,
  ForumGroup,
  ForumStatus,
  GroupStatus,
  ReportStatus,
  SendPermission,
} from "../types";

type Translate = (key: string) => string;

/** Forum status → the design labels مسودة / منشور / مؤرشف. */
export function forumStatusLabel(status: ForumStatus, t: Translate) {
  if (status === "draft") return t("status.draft");
  if (status === "archived") return t("status.archived");
  return t("status.active");
}

export function forumStatusTone(status: ForumStatus): ChipTone {
  if (status === "draft") return "draft";
  if (status === "archived") return "muted";
  return "success";
}

export function groupStatusLabel(status: GroupStatus, t: Translate) {
  return status === "archived"
    ? t("status.groupArchived")
    : t("status.groupActive");
}

export function groupStatusTone(status: GroupStatus): ChipTone {
  return status === "archived" ? "muted" : "success";
}

export function sendPermissionLabel(value: SendPermission, t: Translate) {
  return t(`sendPermission.${value}`);
}

/** «الصور، الصوت، الملفات» derived from the three allow_* flags. */
export function allowedMediaLabel(group: ForumGroup, t: Translate) {
  const parts: string[] = [];
  if (group.allow_images) parts.push(t("media.images"));
  if (group.allow_voice) parts.push(t("media.voice"));
  if (group.allow_files) parts.push(t("media.files"));
  return parts.length > 0 ? parts.join("، ") : t("media.none");
}

export function announcementStatusLabel(
  status: AnnouncementStatus | "archived",
  t: Translate,
) {
  return t(`announcements.statusValues.${status}`);
}

export function announcementStatusTone(
  status: AnnouncementStatus | "archived",
): ChipTone {
  if (status === "published") return "success";
  if (status === "draft") return "draft";
  return "muted";
}

export function reportStatusLabel(status: ReportStatus, t: Translate) {
  return t(`reports.statusValues.${status}`);
}

export function reportStatusTone(status: ReportStatus): ChipTone {
  if (status === "new") return "danger";
  if (status === "in_review") return "draft";
  if (status === "resolved") return "success";
  return "muted";
}

/** Localised `action_label` fallback for the activity log. */
export function activityActionLabel(
  action: string,
  fallback: string,
  t: Translate,
) {
  if (fallback) return fallback;
  // Message keys cannot contain `.`, so `group.created` lives at `group_created`.
  const key = action.replace(/\./g, "_");
  try {
    return t(`forum.activity.actions.${key}`);
  } catch {
    return action;
  }
}
