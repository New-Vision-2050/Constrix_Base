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
  const isDir = !Boolean(selectedDocument?.is_file);
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
    <div className="flex items-center justify-between p-4 border-b border-border">
      <div className="flex items-center gap-3">
        <Image src={imageIcon} alt="Folder" width={24} height={24} />

        <div className="text-right">
          <h2 className="text-foreground font-medium text-lg">
            {title}
          </h2>
          {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
          <Icon type="menu" size={20} color="currentColor" className="text-muted-foreground" />
        </button>
        <button
          onClick={handleClose}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Close"
        >
          <Icon type="close" size={20} color="currentColor" className="text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
