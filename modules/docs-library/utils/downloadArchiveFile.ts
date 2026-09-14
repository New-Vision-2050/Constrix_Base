import { apiClient, baseURL } from "@/config/axios-config";

function resolveMimeType(
  fileType?: string | null,
  mimeType?: string | null,
): string {
  if (mimeType && mimeType.trim()) return mimeType;

  switch (fileType) {
    case "image":
      return "image/*";
    case "pdf":
      return "application/pdf";
    case "document":
      return "application/octet-stream";
    default:
      return "application/octet-stream";
  }
}

/**
 * Download an archive file via authenticated API.
 * Uses document `name` (archive code) for the saved filename — never storage URL.
 */
export async function downloadArchiveFile(args: {
  fileId: string;
  /** Archive document code from API `name` (no storage path / UUID suffix). */
  downloadName: string;
  fileType?: string | null;
  mimeType?: string | null;
}) {
  const response = await apiClient.get(
    `${baseURL}/files/${args.fileId}/download`,
    { responseType: "blob" },
  );

  const mime = resolveMimeType(args.fileType, args.mimeType);
  const blob = new Blob([response.data], { type: mime });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = args.downloadName || "document";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
