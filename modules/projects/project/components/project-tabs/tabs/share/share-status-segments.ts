/** Share assignment workflow grouping (same buckets as project inbox widgets). */
export type ShareStatusSegment =
  | "awaiting"
  | "in_progress"
  | "accepted"
  | "rejected";

export function assignmentStatusSegment(status: string | undefined): ShareStatusSegment {
  const k = (status ?? "").trim().toLowerCase();
  if (k === "accepted" || k === "approved") return "accepted";
  if (k === "rejected") return "rejected";
  if (k === "pending") return "awaiting";
  return "in_progress";
}

export type ShareSegmentCounts = {
  total: number;
  awaiting: number;
  inProgress: number;
  accepted: number;
  rejected: number;
};

export function countShareAssignmentSegments(
  rows: { status: string }[],
): ShareSegmentCounts {
  const out: ShareSegmentCounts = {
    total: rows.length,
    awaiting: 0,
    inProgress: 0,
    accepted: 0,
    rejected: 0,
  };
  for (const row of rows) {
    switch (assignmentStatusSegment(row.status)) {
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
