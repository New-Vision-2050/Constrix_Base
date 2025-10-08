import { DocumentT } from "../../../types/Directory";
import { Checkbox } from "@/components/ui/checkbox";
import { FileIcon } from "./FileIcon";
import { StatusBadge } from "./StatusBadge";
import { ActionButtons } from "./ActionButtons";
import ToggleControl from "@/modules/clients/components/ToggleControl";
import { useTranslations } from "next-intl";
import { usePublicDocsCxt } from "../../../contexts/public-docs-cxt";

/**
 * Table row component for displaying document information
 * Renders a single document row with all relevant data
 */
interface TableRowProps {
  document: DocumentT;
  isFolder?: boolean;
}

export const TableRow = ({ document, isFolder = false }: TableRowProps) => {
  const { setParentId, setTempParentId, setOpenDirWithPassword } =
    usePublicDocsCxt();
  const t = useTranslations("docs-library.publicDocs.table");
  const formatFileSize = (size?: number) => {
    if (!size) return "-";
    const mb = size / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const handleClick = () => {
    console.log("isFolderisFolder", isFolder, document?.is_password);
    if (isFolder) {
      if (document?.is_password == 1) {
        setOpenDirWithPassword(true);
        setTempParentId(document.id);
      } else {
        setParentId(document.id);
      }
    }
  };

  return (
    <tr className="hover:bg-muted/30 transition-colors">
      <td className="px-4 py-3">
        <Checkbox />
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <FileIcon isFolder={isFolder} fileName={document.name} />
          <span
            onClick={handleClick}
            className={`font-medium ${
              isFolder && "hover:underline cursor-pointer"
            }`}
          >
            {document.name}
          </span>
        </div>
      </td>

      <td className="px-4 py-3 text-muted-foreground">
        {document?.last_log?.user?.name ?? "-"}
      </td>

      <td className="px-4 py-3 text-muted-foreground">
        {formatFileSize(document.file?.size)}
      </td>

      <td className="px-4 py-3 text-muted-foreground text-center">
        {document?.files_count ?? "-"}
      </td>

      <td className="px-4 py-3 text-muted-foreground text-sm">
        {document?.last_log?.title ?? "-"}
      </td>

      <td className="px-4 py-3">
        <ToggleControl
          activeLabel={t("active")}
          inactiveLabel={t("inactive")}
          checked={document.status == 1 ? true : false}
          onChange={(checked) => {}}
          disabled={false}
        />
      </td>

      <td className="px-4 py-3">
        <ActionButtons document={document} />
      </td>
    </tr>
  );
};
