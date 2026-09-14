import type { DocumentAttachment } from "./types";

/** Maps `attachments_preview` / `items` entries from attachment-requests API to UI rows. */
export function mapAttachmentRequestFileToDocumentAttachment(entry: {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size_formatted: string;
  response_notes?: string | null;
  responded_by?: { id: string; name: string } | null;
  responded_at?: string | null;
}): DocumentAttachment {
  // Guide: display from `file_name` only — never parse storage URL / path.
  return {
    id: entry.id,
    name: entry.file_name?.trim() || "attachment",
    url: entry.file_url,
    type: entry.file_type,
    size: entry.file_size_formatted,
    response_notes: entry.response_notes,
    responded_by: entry.responded_by,
    responded_at: entry.responded_at,
  };
}

export function mapAttachmentRequestFilesToDocumentAttachments(
  list: Array<
    Parameters<typeof mapAttachmentRequestFileToDocumentAttachment>[0]
  >,
): DocumentAttachment[] {
  return list.map(mapAttachmentRequestFileToDocumentAttachment);
}
