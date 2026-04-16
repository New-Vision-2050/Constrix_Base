import type { DocumentAttachment } from "./types";

function displayNameFromUrl(fileUrl: string): string {
  try {
    const path = fileUrl.split("?")[0].split("#")[0];
    const seg = path.split("/").filter(Boolean).pop();
    return seg?.trim() || "attachment";
  } catch {
    return "attachment";
  }
}

/** Maps `attachments_preview` / `items` entries from attachment-requests API to UI rows. */
export function mapAttachmentRequestFileToDocumentAttachment(entry: {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size_formatted: string;
}): DocumentAttachment {
  const name = entry.file_name?.trim() || displayNameFromUrl(entry.file_url);
  return {
    id: entry.id,
    name,
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
