import Image, { StaticImageData } from "next/image";
import PDFIcon from "@/assets/icons/PDF.png";
import ImageIcon from "@/assets/icons/img.png";
import UndefinedIcon from "@/assets/icons/undefined-file.png";
import DirIcon from "@/assets/icons/directory.png";
import { Checkbox } from "@/components/ui/checkbox";
import { DocumentT } from "../../types/Directory";
import { usePublicDocsCxt } from "../../contexts/public-docs-cxt";
import {
  Eye,
  EyeOff,
  FolderOpen,
  Pencil,
  SquareMenu,
  Trash,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import { useState } from "react";
import { apiClient, baseURL } from "@/config/axios-config";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { useOptionalDocsLibraryCxt } from "@/modules/docs-library/context/docs-library-cxt";
import PdfGridThumbnail from "@/modules/docs-library/components/PdfGridThumbnail";

export default function GridItem({
  document,
  isDir,
}: {
  document: DocumentT;
  isDir?: boolean;
}) {
  // declare and define component variables
  const date = new Date(document?.created_at);
  const {
    projectId,
    setOpenDirWithPassword,
    setTempParentId,
    setParentId,
    storeSelectedDocument,
    selectedDocument,
    toggleDocInSelectedDocs,
    setVisitedDirs,
    setEditedDoc,
    setOpenDirDialog,
    setOpenFileDialog,
    refetchDocs,
    setDocToView,
    setSearchData,
  } = usePublicDocsCxt();
  const { can } = usePermissions();
  const docsLibrary = useOptionalDocsLibraryCxt();
  const [openDelete, setOpenDelete] = useState(false);
  const t = useTranslations("docs-library.publicDocs.table.actions");
  
  // Manual date formatting to avoid hydration issues
  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const formattedDate = formatDate(date);
  // calc file size
  const fileSize = isDir ? document?.size : document?.file?.size;
  const fileSizeInMB = (fileSize || 0) / 1024 / 1024;
  // image url
  let imageUrl = document?.file?.url;
  let fileType = document?.file?.type;

  // Validate imageUrl - check if it's a valid URL
  const isValidUrl = (url: string | undefined | null): boolean => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };
  let imageIcon: StaticImageData;
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
  const isPdf = fileType === "pdf" && !isDir;

  const isDocInDetails =
    selectedDocument && document.id == selectedDocument?.id;

  const handleViewDetails = () => {
    if (!selectedDocument) storeSelectedDocument(document);
    else {
      if (document.id == selectedDocument.id) storeSelectedDocument(undefined);
      else storeSelectedDocument(document);
    }
  };

  const handleOpenDir = () => {
    if (isDir) {
      if (document?.is_password == 1) {
        setOpenDirWithPassword(true);
        setTempParentId(document.id);
      } else {
        setParentId(document.id);
        if (!projectId) {
          docsLibrary?.handleChangeParentId(document.id);
        }
      }
      setVisitedDirs((prev) => [...prev, document]);
      setSearchData((prev) => ({ ...prev, search: "" }));
    }
  };

  const handleEdit = () => {
    setEditedDoc(document);
    if (isDir) setOpenDirDialog(true);
    else setOpenFileDialog(true);
  };

  const handleDelete = async () => {
    try {
      const _url =
        baseURL +
        (isDir ? `/folders/${document?.id}` : `/files/${document?.id}`);
      await apiClient.delete(_url);

      toast.success(t("deleteSuccess"));
      setOpenDelete(false);
      refetchDocs();
      if (!isDir && !projectId) {
        docsLibrary?.handleRefetchDocsWidgets();
      }
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message;
      toast.error(errorMsg || t("deleteFailed"));
    }
  };

  const updatedDate = document?.updated_at
    ? formatDate(new Date(document.updated_at))
    : null;

  return (
    <>
      <HoverCard openDelay={300} closeDelay={100}>
        <HoverCardTrigger asChild>
          <div
            className={`w-full h-52 rounded-lg p-3 flex flex-col items-center justify-between relative cursor-pointer border border-transparent hover:border-primary/30 hover:bg-muted/10 transition-colors`}
          >
            {/* icon */}
            <div className="flex items-center justify-center flex-shrink-0 mt-1">
              {!isPdf && (
                <Image
                  src={isValidUrl(imageUrl) ? imageUrl! : imageIcon}
                  alt="Document"
                  width={48}
                  height={48}
                />
              )}
              {isPdf && document.file && (
                <PdfGridThumbnail fileId={document.id} file={document.file} />
              )}
            </div>

            {/* name — truncated, fixed height */}
            <p className="w-full text-center text-sm font-medium leading-tight line-clamp-2 px-1 flex-shrink-0">
              {document?.name}
            </p>

            {/* date + size */}
            <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
              <p className="text-center text-xs font-light text-muted-foreground">{formattedDate}</p>
              <p className="text-center text-xs font-light text-muted-foreground">
                {fileSizeInMB.toFixed(2)} MB
              </p>
            </div>

            {/* actions — pinned to bottom */}
            <TooltipProvider>
              <div className="flex items-center justify-center gap-3 flex-shrink-0">
                {/* view document */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    {isDocInDetails ? (
                      <EyeOff
                        onClick={handleViewDetails}
                        className="w-4 h-4 text-primary hover:text-primary/80 cursor-pointer transition-colors"
                      />
                    ) : (
                      <Eye
                        onClick={handleViewDetails}
                        className="w-4 h-4 text-primary hover:text-primary/80 cursor-pointer transition-colors"
                      />
                    )}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isDocInDetails ? "Close Details" : "View Details"}</p>
                  </TooltipContent>
                </Tooltip>

                {/* more options */}
                {!isDir && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SquareMenu
                        onClick={() => {
                          setDocToView(document);
                          setSearchData((prev) => ({ ...prev, search: "" }));
                        }}
                        className="w-4 h-4 text-primary hover:text-primary/80 cursor-pointer transition-colors"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>More Options</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {/* open directory */}
                {isDir && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <FolderOpen
                        onClick={handleOpenDir}
                        className="w-4 h-4 text-green-500 hover:text-green-600 cursor-pointer transition-colors"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Open Directory</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {/* edit document */}
                {Boolean(document.can_update) &&
                  (isDir
                    ? can(PERMISSIONS.library.folder.update)
                    : can(PERMISSIONS.library.file.update)) && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Pencil
                          onClick={handleEdit}
                          className="w-4 h-4 text-orange-500 hover:text-orange-600 cursor-pointer transition-colors"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit Document</p>
                      </TooltipContent>
                    </Tooltip>
                  )}

                {/* delete document */}
                {Boolean(document.can_delete) &&
                  (isDir
                    ? can(PERMISSIONS.library.folder.delete)
                    : can(PERMISSIONS.library.file.delete)) && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Trash
                          onClick={() => setOpenDelete(true)}
                          className="w-4 h-4 text-red-500 hover:text-red-600 cursor-pointer transition-colors"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete Document</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
              </div>
            </TooltipProvider>

            {/* checkbox */}
            <Checkbox
              className="absolute top-2 right-2"
              onCheckedChange={() => toggleDocInSelectedDocs(document)}
            />
          </div>
        </HoverCardTrigger>

        {/* hover popover — full name only */}
        <HoverCardContent
          side="top"
          align="center"
          className="max-w-xs z-50 text-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="font-medium text-foreground break-words text-center">{document?.name}</p>
        </HoverCardContent>
      </HoverCard>

      <ConfirmationDialog
        open={openDelete}
        onClose={() => {
          setOpenDelete(false);
        }}
        onConfirm={handleDelete}
        description={isDir ? t("deleteDir") : t("deleteFile")}
        showDatePicker={false}
      />
    </>
  );
}
