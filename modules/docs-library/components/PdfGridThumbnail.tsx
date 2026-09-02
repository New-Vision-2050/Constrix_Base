import Image from "next/image";
import PDFIcon from "@/assets/icons/PDF.png";
import { useFilePreviewUrl } from "../hooks/useFilePreviewUrl";

interface PdfGridThumbnailProps {
  fileId: string;
  file: { type?: string; url?: string; mime_type?: string };
}

export default function PdfGridThumbnail({
  fileId,
  file,
}: PdfGridThumbnailProps) {
  const { previewUrl, loading } = useFilePreviewUrl(fileId, file);

  if (loading || !previewUrl) {
    return <Image src={PDFIcon} alt="PDF" width={48} height={48} />;
  }

  return (
    <iframe
      src={previewUrl}
      width={48}
      height={48}
      className="pointer-events-none border-0"
      title="PDF preview"
    />
  );
}
