import React from "react";

interface PropsT {
  src: string;
}

export default function PdfViewer({ src }: PropsT) {
  return (
    <iframe
      src={src}
      className="w-[95%] h-[70vh] rounded-[3rem] border-none"
      title="PDF Viewer"
    />
  );
}
