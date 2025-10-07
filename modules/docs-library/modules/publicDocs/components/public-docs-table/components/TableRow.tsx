import { DocumentT } from "../../../types/Directory";
import { Checkbox } from "@/components/ui/checkbox";
import { FileIcon } from "./FileIcon";
import { StatusBadge } from "./StatusBadge";
import { ActionButtons } from "./ActionButtons";

/**
 * Table row component for displaying document information
 * Renders a single document row with all relevant data
 */
interface TableRowProps {
  document: DocumentT;
  isFolder?: boolean;
}

export const TableRow = ({ document, isFolder = false }: TableRowProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-SA");
  };

  const formatFileSize = (size?: number) => {
    if (!size) return "-";
    const mb = size / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <tr className="hover:bg-muted/30 transition-colors">
      <td className="px-4 py-3">
        <Checkbox />
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <FileIcon isFolder={isFolder} fileName={document.name} />
          <span className="font-medium">{document.name}</span>
        </div>
      </td>

      <td className="px-4 py-3 text-muted-foreground">محمد خالد</td>

      <td className="px-4 py-3 text-muted-foreground">
        {formatFileSize(document.file?.size)}
      </td>

      <td className="px-4 py-3 text-center">-</td>

      <td className="px-4 py-3 text-muted-foreground text-sm">
        {formatDate(document.created_at)}
      </td>

      <td className="px-4 py-3">
        <ActionButtons documentId={document.id} />
      </td>
    </tr>
  );
};
