import EmbeddedFilePreview from "@/components/shared/EmbeddedFilePreview";

interface PropsT {
  src: string;
  mimeType?: string;
  fileType?: string;
}

export default function PdfViewer({ src, mimeType, fileType }: PropsT) {
  return (
    <EmbeddedFilePreview
      src={src}
      mimeType={mimeType}
      fileType={fileType}
      title="File preview"
      className="w-[95%] h-[70vh] rounded-[3rem] border-none"
    />
  );
}
