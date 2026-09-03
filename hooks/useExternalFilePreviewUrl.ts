import { fetchPreviewBlobUrl } from "@/lib/file-preview/fetchPreviewBlobUrl";
import { isImagePreview } from "@/lib/file-preview/utils";
import { useEffect, useState } from "react";

type UseExternalFilePreviewUrlOptions = {
  mimeType?: string;
  fileType?: string;
  enabled?: boolean;
};

/**
 * Resolves a preview URL for files stored on external object storage or behind auth.
 * Images use the direct URL (works in `<img>`). Other types are proxied to a blob URL.
 */
export function useExternalFilePreviewUrl(
  src: string | undefined | null,
  options?: UseExternalFilePreviewUrlOptions,
) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isImage = isImagePreview(
    options?.mimeType,
    options?.fileType,
    src ?? undefined,
  );

  useEffect(() => {
    const url = src?.trim();
    if (!url || options?.enabled === false) {
      setPreviewUrl(null);
      setLoading(false);
      return;
    }

    if (isImagePreview(options?.mimeType, options?.fileType, url)) {
      setPreviewUrl(url);
      setLoading(false);
      return;
    }

    let cancelled = false;
    let blobUrl: string | null = null;

    const loadPreview = async () => {
      setLoading(true);
      try {
        blobUrl = await fetchPreviewBlobUrl(url, options?.mimeType);
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
  }, [src, options?.mimeType, options?.fileType, options?.enabled]);

  return { previewUrl, loading, isImage };
}
