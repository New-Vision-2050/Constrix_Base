import type { ClientRequestRow } from "@/services/api/client-requests";
import type { InboxApprovalTimelineEntry } from "./types";

/**
 * Builds approval timeline entries for a CRM client request row
 * (synthetic until the API exposes a history list).
 */
export function buildClientRequestApprovalTimelineEntries(
  row: ClientRequestRow,
  tDoc: (key: string) => string,
  tInbox: (key: string) => string,
): InboxApprovalTimelineEntry[] {
  const submitter =
    row.client?.name?.trim() ||
    row.client_request_receiver_from?.name?.trim() ||
    "—";

  const created: InboxApprovalTimelineEntry = {
    id: `${row.id}-timeline-created`,
    title: tDoc("historyActionRequestCreated"),
    chipLabel: tDoc("historyActionRequestCreated"),
    palette: "primary",
    userLine: submitter,
  };

  const status = String(row.status_client_request ?? "")
    .trim()
    .toLowerCase();

  if (status === "pending") {
    return [
      created,
      {
        id: `${row.id}-timeline-awaiting`,
        title: tInbox("statusPending"),
        chipLabel: tDoc("pending"),
        palette: "warning",
        userLine: "—",
      },
    ];
  }

  if (status === "accepted") {
    return [
      created,
      {
        id: `${row.id}-timeline-accepted`,
        title: tDoc("historyActionRequestApproved"),
        chipLabel: tDoc("approved"),
        palette: "success",
        userLine: "—",
      },
    ];
  }

  if (status === "rejected") {
    return [
      created,
      {
        id: `${row.id}-timeline-rejected`,
        title: tDoc("historyActionRequestDeclined"),
        chipLabel: tDoc("rejected"),
        palette: "error",
        userLine: "—",
      },
    ];
  }

  return [created];
}
