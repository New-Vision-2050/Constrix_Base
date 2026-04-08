import type { ProjectInboxRow } from "@/modules/projects/inbox/map-invitation-to-row";

/** Groupings used for widgets and the status filter (invitation workflow, not project status). */
export type InboxStatusSegment =
  | "awaiting"
  | "in_progress"
  | "accepted"
  | "rejected";

export function inboxInvitationStatusSegment(
  invitationStatus: string | undefined,
): InboxStatusSegment {
  const k = (invitationStatus ?? "").trim().toLowerCase();
  if (k === "accepted" || k === "approved") return "accepted";
  if (k === "rejected") return "rejected";
  if (k === "pending") return "awaiting";
  return "in_progress";
}

export type InboxSegmentCounts = {
  total: number;
  awaiting: number;
  inProgress: number;
  accepted: number;
  rejected: number;
};

export function countInboxSegments(rows: ProjectInboxRow[]): InboxSegmentCounts {
  const out: InboxSegmentCounts = {
    total: rows.length,
    awaiting: 0,
    inProgress: 0,
    accepted: 0,
    rejected: 0,
  };
  for (const row of rows) {
    switch (inboxInvitationStatusSegment(row.invitation_status)) {
      case "awaiting":
        out.awaiting += 1;
        break;
      case "in_progress":
        out.inProgress += 1;
        break;
      case "accepted":
        out.accepted += 1;
        break;
      case "rejected":
        out.rejected += 1;
        break;
      default:
        break;
    }
  }
  return out;
}
