import Image, { StaticImageData } from "next/image";
import PDFIcon from "@/assets/icons/PDF.png";
import ImageIcon from "@/assets/icons/img.png";
import UndefinedIcon from "@/assets/icons/undefined-file.png";
import DirIcon from "@/assets/icons/directory.png";
import { Checkbox } from "@/components/ui/checkbox";
import { DocumentT } from "../../types/Directory";
import { usePublicDocsCxt } from "../../contexts/public-docs-cxt";

export default function GridItem({
  document,
  isDir,
}: {
  document: DocumentT;
  isDir?: boolean;
}) {
  // declare and define component variables
  const date = new Date(document?.created_at);
  const { storeSelectedDocument, selectedDocument } = usePublicDocsCxt();
  const formattedDate = date.toLocaleDateString("en-GB").replace(/\//g, "-");
  // calc file size
  const fileSize = document?.file?.size;
  const fileSizeInMB = (fileSize || 0) / 1024 / 1024;
  // image url
  let imageUrl = document?.file?.url;
  let fileType = document?.file?.type;
  let imageIcon: StaticImageData;
  if (isDir) {
    imageIcon = DirIcon;
  } else {
    switch (fileType) {
      case "pdf":
        imageIcon = PDFIcon;
        break;
      case "image":
        imageIcon = ImageIcon;
        break;
      case "doc":
        imageIcon = PDFIcon;
        break;
      default:
        imageIcon = UndefinedIcon;
    }
  }
  // check if file is pdf
  const isPdf = fileType === "pdf" && Boolean(imageUrl);

  const handleClick = () => {
    if (!selectedDocument) storeSelectedDocument(document);
    else {
      if (document.id == selectedDocument.id) storeSelectedDocument(undefined);
      else storeSelectedDocument(document);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`w-[220px] rounded-lg p-4 flex flex-col items-center justify-between relative cursor-pointer`}
    >
      {!isPdf && (
        <Image src={imageUrl || imageIcon} alt="PDF" width={50} height={50} />
      )}
      {isPdf && <iframe src={imageUrl} width={50} height={50} />}
      <p className="text-center text-lg font-medium">{document?.name}</p>
      <p className="text-center text-sm font-light">{formattedDate}</p>
      <p className="text-center text-sm font-light">
        {fileSizeInMB.toFixed(2)} MB
      </p>
      <Checkbox className="absolute top-2 right-2" />
    </div>
  );
}
