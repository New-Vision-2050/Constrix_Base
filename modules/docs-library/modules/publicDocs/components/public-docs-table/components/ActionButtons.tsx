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
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import ShareDialog from "../../../views/public-docs-tab/share-dialog";
import { useDocsLibraryCxt } from "@/modules/docs-library/context/docs-library-cxt";

/**
 * Action buttons component
 * Provides document action menu with various operations
 */
interface ActionButtonsProps {
  document: DocumentT;
  isFolder?: boolean;
}

export const ActionButtons = ({ document, isFolder }: ActionButtonsProps) => {
  const { can } = usePermissions();
  const t = useTranslations("docs-library.publicDocs.table.actions");
  const [openDelete, setOpenDelete] = useState(false);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const { handleRefetchDocsWidgets } = useDocsLibraryCxt();
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
        (isFolder ? `/folders/${document?.id}` : `/files/${document?.id}`);
      await apiClient.delete(_url);

      toast.success(t("deleteSuccess"));
      setOpenDelete(false);
      refetchDocs();
      if (!isFolder) handleRefetchDocsWidgets();
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message;
      toast.error(errorMsg || t("deleteFailed"));
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
        if (!isFolder) {
          const _url = document?.file?.url;
          window.open(_url, "_blank");
        }
        break;
      case "share":
        setOpenShareDialog(true);
        break;
      case "edit":
        setEditedDoc(document);
        if (isFolder) setOpenDirDialog(true);
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
          <Button
            variant="secondary"
            size="sm"
            className="p-2 hover:bg-muted"
            // disabled={!can(PERMISSIONS.library.file.update)}
          >
            {t("title")}
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-44">
          {/* view document */}
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

          {/* download document */}
          <DropdownMenuItem
            onClick={() => handleAction("download")}
            className="flex items-center gap-2"
            disabled={isFolder}
          >
            <Download className="h-4 w-4" />
            {t("download")}
          </DropdownMenuItem>

          {/* share document */}
          {/* <DropdownMenuItem
            onClick={() => handleAction("share")}
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            {t("share")}
          </DropdownMenuItem> */}

          <DropdownMenuSeparator />

          {/* edit document */}
          <DropdownMenuItem
            onClick={() => handleAction("edit")}
            disabled={
              !Boolean(document.can_update) ||
              (isFolder
                ? !can(PERMISSIONS.library.folder.update)
                : !can(PERMISSIONS.library.file.update))
            }
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            {t("edit")}
          </DropdownMenuItem>

          {/* delete document */}
          <DropdownMenuItem
            onClick={() => handleAction("delete")}
            disabled={
              !Boolean(document.can_delete) ||
              !can(PERMISSIONS.library.file.delete)
            }
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
        description={isFolder ? t("deleteDir") : t("deleteFile")}
        showDatePicker={false}
      />
      <ShareDialog
        open={openShareDialog}
        onClose={() => setOpenShareDialog(false)}
      />
    </>
  );
};
