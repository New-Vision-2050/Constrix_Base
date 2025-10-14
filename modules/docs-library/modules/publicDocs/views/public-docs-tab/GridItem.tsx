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
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import { useState } from "react";
import { apiClient, baseURL } from "@/config/axios-config";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

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
  } = usePublicDocsCxt();
  const [openDelete, setOpenDelete] = useState(false);
  const t = useTranslations("docs-library.publicDocs.table.actions");
  const formattedDate = date.toLocaleDateString("en-GB").replace(/\//g, "-");
  // calc file size
  const fileSize = document?.file?.size;
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
  // check if file is pdf
  const isPdf = fileType === "pdf" && isValidUrl(imageUrl);

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
      }
      setVisitedDirs((prev) => [...prev, document]);
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
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message;
      toast.error(errorMsg || t("deleteFailed"));
    }
  };

  return (
    <>
      <div
        className={`w-[220px] rounded-lg p-4 flex flex-col items-center justify-between relative`}
      >
        {!isPdf && (
          <Image
            src={isValidUrl(imageUrl) ? imageUrl! : imageIcon}
            alt="Document"
            width={50}
            height={50}
          />
        )}
        {isPdf && <iframe src={imageUrl} width={50} height={50} />}
        <p className="text-center text-lg font-medium">{document?.name}</p>
        <p className="text-center text-sm font-light">{formattedDate}</p>
        <p className="text-center text-sm font-light">
          {fileSizeInMB.toFixed(2)} MB
        </p>
        <TooltipProvider>
          <div className="flex items-center justify-center gap-4">
            {/* view document */}
            <Tooltip>
              <TooltipTrigger asChild>
                {isDocInDetails ? (
                  <EyeOff
                    onClick={handleViewDetails}
                    className="w-5 h-5 text-blue-500 hover:text-blue-600 cursor-pointer transition-colors"
                  />
                ) : (
                  <Eye
                    onClick={handleViewDetails}
                    className="w-5 h-5 text-blue-500 hover:text-blue-600 cursor-pointer transition-colors"
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
                    onClick={() => setDocToView(document)}
                    className="w-5 h-5 text-blue-500 hover:text-blue-600 cursor-pointer transition-colors"
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
                    className="w-5 h-5 text-green-500 hover:text-green-600 cursor-pointer transition-colors"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Open Directory</p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* edit document */}
            {Boolean(document.can_update) && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Pencil
                    onClick={handleEdit}
                    className="w-5 h-5 text-orange-500 hover:text-orange-600 cursor-pointer transition-colors"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit Document</p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* delete document */}
            {Boolean(document.can_delete) && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Trash
                    onClick={() => setOpenDelete(true)}
                    className="w-5 h-5 text-red-500 hover:text-red-600 cursor-pointer transition-colors"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete Document</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </TooltipProvider>
        <Checkbox
          className="absolute top-2 right-2"
          onCheckedChange={() => toggleDocInSelectedDocs(document)}
        />
      </div>
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
