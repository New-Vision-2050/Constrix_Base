import type { DocumentAttachment } from "./types";

/** Maps `attachments_preview` / `items` entries from attachment-requests API to UI rows. */
export function mapAttachmentRequestFileToDocumentAttachment(entry: {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size_formatted: string;
}): DocumentAttachment {
  return {
    id: entry.id,
    name: entry.file_name,
    url: entry.file_url,
    type: entry.file_type,
    size: entry.file_size_formatted,
  };
}

export function mapAttachmentRequestFilesToDocumentAttachments(
  list: Array<Parameters<typeof mapAttachmentRequestFileToDocumentAttachment>[0]>,
): DocumentAttachment[] {
  return list.map(mapAttachmentRequestFileToDocumentAttachment);
}
