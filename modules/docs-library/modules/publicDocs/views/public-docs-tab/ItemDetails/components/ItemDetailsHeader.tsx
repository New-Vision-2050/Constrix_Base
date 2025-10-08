import Image, { StaticImageData } from "next/image";
import Icon from "./Icon";
import folderImg from "@/assets/icons/directory.png";
import { usePublicDocsCxt } from "../../../../contexts/public-docs-cxt";
import DirIcon from "@/assets/icons/directory.png";
import PDFIcon from "@/assets/icons/PDF.png";
import ImageIcon from "@/assets/icons/img.png";
import UndefinedIcon from "@/assets/icons/undefined-file.png";

interface ItemDetailsHeaderProps {
  title: string;
  subtitle?: string;
}

export default function ItemDetailsHeader({
  title,
  subtitle,
}: ItemDetailsHeaderProps) {
  const { selectedDocument, storeSelectedDocument } =
    usePublicDocsCxt();

  const handleClose = () => {
    storeSelectedDocument(undefined);
  };

  // image url
  let imageUrl = selectedDocument?.file?.url;
  let fileType = selectedDocument?.file?.type;
  let imageIcon: StaticImageData;
  const isDir = !Boolean(selectedDocument?.reference_number);
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

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-700">
      {/* Title and Icon */}
      <div className="flex items-center gap-3">
        {/* Folder Icon */}
        <Image src={imageIcon} alt="Folder" width={24} height={24} />

        <div className="text-right">
          <h2 className="text-dark dark:text-white font-medium text-lg">
            {title}
          </h2>
          {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Menu Icon */}
        <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
          <Icon type="menu" size={20} color="#9CA3AF" />
        </button>
        {/* Close Icon */}
        <button
          onClick={handleClose}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Close"
        >
          <Icon type="close" size={20} color="#9CA3AF" />
        </button>
      </div>
    </div>
  );
}
