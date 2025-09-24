import Image from "next/image";
import Icon from "./Icon";
import folderImg from "@/assets/icons/directory.png";
import { usePublicDocsCxt } from "../../../../contexts/public-docs-cxt";

interface ItemDetailsHeaderProps {
  title: string;
  subtitle?: string;
}

export default function ItemDetailsHeader({
  title,
  subtitle,
}: ItemDetailsHeaderProps) {
  const { toggleShowItemDetials } = usePublicDocsCxt();
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-700">
      {/* Title and Icon */}
      <div className="flex items-center gap-3">
        {/* Folder Icon */}
        <Image src={folderImg} alt="Folder" width={24} height={24} />

        <div className="text-right">
          <h2 className="text-white font-medium text-lg">{title}</h2>
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
          onClick={toggleShowItemDetials}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Close"
        >
          <Icon type="close" size={20} color="#9CA3AF" />
        </button>
      </div>
    </div>
  );
}
