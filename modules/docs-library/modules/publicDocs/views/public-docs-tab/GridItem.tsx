import Image, { StaticImageData } from "next/image";
import PDFIcon from "@/assets/icons/PDF.png";
import ImageIcon from "@/assets/icons/img.png";
import UndefinedIcon from "@/assets/icons/undefined-file.png";
import DirIcon from "@/assets/icons/directory.png";
import { Checkbox } from "@/components/ui/checkbox";
import { DirectoryT } from "../../types/Directory";

export default function GridItem({
  folder,
  isDir,
}: {
  folder: DirectoryT;
  isDir?: boolean;
}) {
  // declare and define component variables
  const date = new Date(folder.created_at);
  const formattedDate = date.toLocaleDateString("en-GB").replace(/\//g, "-");
  // calc file size
  const fileSize = folder?.file?.size;
  const fileSizeInMB = (fileSize || 0) / 1024 / 1024;
  // image url
  let imageUrl = folder?.file?.url;
  let fileType = folder?.file?.type;
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

  return (
    <div className="w-[220px] rounded-lg p-4 flex flex-col items-center justify-between relative">
      <Image src={imageUrl || imageIcon} alt="PDF" width={50} height={50} />
      <p className="text-center text-lg font-medium">{folder.name}</p>
      <p className="text-center text-sm font-light">{formattedDate}</p>
      <p className="text-center text-sm font-light">
        {fileSizeInMB.toFixed(2)} MB
      </p>
      <Checkbox className="absolute top-2 right-2" />
    </div>
  );
}
