"use client";

import { useExternalFilePreviewUrl } from "@/hooks/useExternalFilePreviewUrl";
import { cn } from "@/lib/utils";

type EmbeddedFilePreviewProps = {
  src: string;
  mimeType?: string;
  fileType?: string;
  title?: string;
  className?: string;
  iframeClassName?: string;
  imgClassName?: string;
  width?: string | number;
  height?: string | number;
  loadingText?: string;
  errorText?: string;
};

export default function EmbeddedFilePreview({
  src,
  mimeType,
  fileType,
  title = "File preview",
  className,
  iframeClassName,
  imgClassName,
  width = "100%",
  height = "100%",
  loadingText = "جاري تحميل المعاينة...",
  errorText = "تعذر تحميل المعاينة",
}: EmbeddedFilePreviewProps) {
  const { previewUrl, loading, isImage } = useExternalFilePreviewUrl(src, {
    mimeType,
    fileType,
    enabled: Boolean(src),
  });

  if (!src) {
    return null;
  }

  if (loading) {
    return (
      <p className={cn("text-sm text-muted-foreground", className)}>
        {loadingText}
      </p>
    );
  }

  if (!previewUrl) {
    return (
      <p className={cn("text-sm text-muted-foreground", className)}>
        {errorText}
      </p>
    );
  }

  if (isImage) {
    return (
      <img
        src={previewUrl}
        alt={title}
        width={width}
        height={height}
        className={cn("object-contain", imgClassName, className)}
      />
    );
  }

  return (
    <iframe
      src={previewUrl}
      title={title}
      width={width}
      height={height}
      className={cn("border-0", iframeClassName, className)}
    />
  );
}
