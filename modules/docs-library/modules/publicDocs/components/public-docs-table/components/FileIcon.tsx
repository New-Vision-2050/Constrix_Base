import { Folder, FileText } from "lucide-react";

/**
 * File icon component
 * Uses API file `type` (not archive `name` / storage URL) for icon color.
 */
interface FileIconProps {
  isFolder?: boolean;
  /** Archive document code — display only; not used for extension sniffing. */
  fileName?: string;
  /** Media.type from API: image | pdf | document | ... */
  fileType?: string;
}

export const FileIcon = ({ isFolder, fileType }: FileIconProps) => {
  const getFileIcon = () => {
    if (isFolder) {
      return <Folder className="h-5 w-5 text-primary" />;
    }

    switch (fileType) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />;
      case "document":
        return <FileText className="h-5 w-5 text-blue-600" />;
      case "image":
        return <FileText className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="flex items-center justify-center">
      {getFileIcon()}
    </div>
  );
};
