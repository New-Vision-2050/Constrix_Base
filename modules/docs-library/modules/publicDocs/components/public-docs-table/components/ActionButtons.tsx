import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Eye,
  Download,
  Share2,
  Edit,
  Trash2,
  EyeClosed,
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
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import { useState } from "react";
import { apiClient, baseURL } from "@/config/axios-config";
import { toast } from "sonner";

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
  const [openDelete, setOpenDelete] = useState(false);
  const {
    setOpenDirDialog,
    setOpenFileDialog,
    setEditedDoc,
    refetchDocs,
    selectedDocument,
    storeSelectedDocument,
  } = usePublicDocsCxt();

  // check current doc in details
  const inDetails = selectedDocument && selectedDocument?.id == document.id;

  const handleDelete = async () => {
    try {
      const _url =
        baseURL +
        (isDirectory ? `/folders/${document?.id}` : `/files/${document?.id}`);
      await apiClient.delete(_url);

      toast.success(t("deleteSuccess"));
      setOpenDelete(false);
      refetchDocs();
    } catch (error) {
      toast.error(t("deleteFailed"));
    }
  };

  const handleAction = (action: string) => {
    // TODO: Implement actual action handlers
    switch (action) {
      case "view":
        if (selectedDocument?.id == document.id)
          storeSelectedDocument(undefined);
        else storeSelectedDocument(document);
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
        setOpenDelete(true);
        break;
      default:
        break;
    }
  };

  return (
    <>
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
            {inDetails ? (
              <EyeClosed className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            {inDetails ? t("hide") : t("view")}
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
      <ConfirmationDialog
        open={openDelete}
        onClose={() => {
          setOpenDelete(false);
        }}
        onConfirm={handleDelete}
        description={isDirectory ? t("deleteDir") : t("deleteFile")}
        showDatePicker={false}
      />
    </>
  );
};
