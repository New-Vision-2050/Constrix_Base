"use client";

import EmbeddedFilePreview from "@/components/shared/EmbeddedFilePreview";

type SharedFilePreviewProps = {
  url: string;
  name: string;
  fileType?: string;
  mimeType?: string;
};

export default function SharedFilePreview({
  url,
  name,
  fileType,
  mimeType,
}: SharedFilePreviewProps) {
  return (
    <EmbeddedFilePreview
      src={url}
      fileType={fileType}
      mimeType={mimeType}
      title={name}
      width="100%"
      height="500px"
    />
  );
}
