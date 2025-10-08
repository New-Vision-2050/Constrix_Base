import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Eye,
  Download,
  Share2,
  Edit,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import { usePublicDocsCxt } from "../../../contexts/public-docs-cxt";
import { DocumentT } from "../../../types/Directory";

/**
 * Action buttons component
 * Provides document action menu with various operations
 */
interface ActionButtonsProps {
  document: DocumentT;
}

export const ActionButtons = ({ document }: ActionButtonsProps) => {
  const isDirectory = !Boolean(document.reference_number);
  const t = useTranslations("docs-library.publicDocs.table.actions");
  const { setOpenDirDialog, setOpenFileDialog, setEditedDoc } =
    usePublicDocsCxt();

  const handleAction = (action: string) => {
    // TODO: Implement actual action handlers
    switch (action) {
      case "view":
        break;
      case "download":
        break;
      case "share":
        break;
      case "edit":
        setEditedDoc(document);
        if (isDirectory) setOpenDirDialog(true);
        else setOpenFileDialog(true);
        break;
      case "delete":
        break;
      default:
        break;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="sm" className="p-2 hover:bg-muted">
          {t("title")}
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-44">
        <DropdownMenuItem
          onClick={() => handleAction("view")}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          {t("view")}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleAction("download")}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          {t("download")}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleAction("share")}
          className="flex items-center gap-2"
        >
          <Share2 className="h-4 w-4" />
          {t("share")}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => handleAction("edit")}
          className="flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          {t("edit")}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleAction("delete")}
          className="flex items-center gap-2 text-destructive focus:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          {t("delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
