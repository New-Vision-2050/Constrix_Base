import { apiClient, baseURL } from "@/config/axios-config";
import { useEffect, useState } from "react";

function getMimeType(fileType: string, fileName: string): string {
  const extension = fileName?.split(".").pop()?.toLowerCase();

  switch (fileType) {
    case "image":
      if (extension === "png") return "image/png";
      if (extension === "jpg" || extension === "jpeg") return "image/jpeg";
      if (extension === "gif") return "image/gif";
      if (extension === "webp") return "image/webp";
      return "image/*";
    case "pdf":
      return "application/pdf";
    case "document":
      if (extension === "doc" || extension === "docx") {
        return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      }
      if (extension === "xls" || extension === "xlsx") {
        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      }
      if (extension === "ppt" || extension === "pptx") {
        return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
      }
      if (extension === "txt") return "text/plain";
      return "application/octet-stream";
    default:
      return "application/octet-stream";
  }
}

/**
 * Resolves a preview URL for docs-library files.
 * External storage URLs (e.g. DigitalOcean Spaces) block iframe embedding via
 * X-Frame-Options, so non-image files are fetched through the authenticated
 * download API and exposed as a same-origin blob URL.
 */
export function useFilePreviewUrl(
  fileId: string | undefined,
  file: { type?: string; url?: string; mime_type?: string } | undefined,
) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!fileId || !file) {
      setPreviewUrl(null);
      return;
    }

    const isImg = file.type === "image";
    if (isImg) {
      setPreviewUrl(file.url ?? null);
      return;
    }

    let cancelled = false;
    let blobUrl: string | null = null;

    const loadPreview = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(
          `${baseURL}/files/${fileId}/download`,
          { responseType: "blob" },
        );
        const mimeType =
          file.mime_type ||
          getMimeType(file.type || "", file.url || "");
        const blob = new Blob([response.data], { type: mimeType });
        blobUrl = URL.createObjectURL(blob);
        if (!cancelled) {
          setPreviewUrl(blobUrl);
        }
      } catch {
        if (!cancelled) {
          setPreviewUrl(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadPreview();

    return () => {
      cancelled = true;
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [fileId, file?.type, file?.url, file?.mime_type]);

  return { previewUrl, loading };
}
