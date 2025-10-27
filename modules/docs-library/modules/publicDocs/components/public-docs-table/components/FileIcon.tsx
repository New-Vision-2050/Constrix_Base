import { Folder, FileText } from "lucide-react";

/**
 * File icon component
 * Displays appropriate icon based on file type
 */
interface FileIconProps {
  isFolder?: boolean;
  fileName?: string;
}

export const FileIcon = ({ isFolder, fileName }: FileIconProps) => {
  const getFileIcon = () => {
    if (isFolder) {
      return <Folder className="h-5 w-5 text-blue-500" />;
    }
    
    // Determine file type from extension
    const extension = fileName?.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'xls':
      case 'xlsx':
        return <FileText className="h-5 w-5 text-green-600" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileText className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="flex items-center justify-center">
      {getFileIcon()}
    </div>
  );
};
