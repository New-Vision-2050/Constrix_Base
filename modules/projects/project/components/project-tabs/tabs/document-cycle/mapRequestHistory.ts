import type { AttachmentRequest } from "@/services/api/projects/attachment-requests/types/response";
import type { DocumentHistoryEntry } from "./types";

export function mapAttachmentRequestHistory(
  item: AttachmentRequest,
): DocumentHistoryEntry[] | undefined {
  const raw = item.history;
  if (!Array.isArray(raw) || raw.length === 0) return undefined;
  const sorted = [...raw].sort(
    (a, b) =>
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );
  return sorted.map((h) => ({
    id: h.id,
    action: h.action,
    description: h.description?.trim() ? h.description : "—",
    userName: h.user?.name?.trim() ?? "",
    timestamp: h.timestamp ?? "",
  }));
}
