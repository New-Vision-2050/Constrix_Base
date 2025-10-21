import SearchableSelect from "@/components/shared/SearchableSelect";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Copy, FolderSymlink, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { usePublicDocsCxt } from "../../../contexts/public-docs-cxt";
import useCopyMoveFile from "../../../hooks/useCopyMoveFile";

type PropsType = {
  open: boolean;
  onClose: () => void;
  type: "copy" | "move";
};

export default function CopyMoveDialog({ open, onClose, type }: PropsType) {
  // detect rtl
  const lang = useLocale();
  const isRtl = lang === "ar";
  // translate
  const t = useTranslations("docs-library.publicDocs.copyMoveDialog");
  const {
    foldersList,
    isErrorFoldersList,
    isLoadingFoldersList,
    selectedDocs,
    refetchDocs,
    clearSelectedDocs
  } = usePublicDocsCxt();
  const [value, setValue] = useState(foldersList?.[0]?.name);

  // mutation for copy/move
  const copyMoveMutation = useCopyMoveFile({
    type,
    onSuccess: () => {
      onClose();
      if (type == "move") refetchDocs();
    },
  });

  // handle confirm
  const handleConfirm = () => {
    if (!value || !selectedDocs?.[0]?.id) return;

    copyMoveMutation.mutate({
      folder_id: value,
      file_id: selectedDocs?.[0]?.id,
    });
    clearSelectedDocs();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-md w-full min-h-[400px]"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <DialogHeader>
          {/* icon */}
          {type === "move" ? (
            <FolderSymlink className="mx-auto text-pink-700 mb-2 h-20 w-20" />
          ) : (
            <Copy className="mx-auto text-pink-700 mb-2 h-20 w-20" />
          )}
          {/* title */}
          <DialogTitle className="text-center text-xl font-semibold text-foreground">
            {type === "copy" ? t("copyTitle") : t("moveTitle")}
          </DialogTitle>
          {/* file name */}
          <p className="text-center text-sm text-muted-foreground">File Name</p>
          {/* close button */}
          <DialogClose
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            disabled={copyMoveMutation.isPending}
          >
            <X className="w-5 h-5 text-foreground" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <div className="flex items-start justify-center relative">
          {/* Loading State */}
          {isLoadingFoldersList ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4 w-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {t("loadingFolders")}
              </p>
            </div>
          ) : /* Error State */
          isErrorFoldersList ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4 w-full">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <X className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-red-600 dark:text-red-400 text-sm text-center">
                {t("errorLoadingFolders")}
              </p>
            </div>
          ) : (
            /* Success State */
            <div className="w-full relative">
              <SearchableSelect
                options={
                  foldersList?.map((folder) => ({
                    value: folder.id,
                    label: folder.name,
                  })) ?? []
                }
                value={value ?? ""}
                label={t("label")}
                onChange={(selectedValue) => setValue(selectedValue.toString())}
                placeholder={t("selectFolder")}
                searchPlaceholder={t("searchFolder")}
                noResultsText={t("noResults")}
                className="w-full"
                disabled={copyMoveMutation.isPending}
              />
              {/* Loading overlay for input field */}
              {copyMoveMutation.isPending && (
                <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex items-center justify-center rounded-md">
                  <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-2 rounded-md shadow-md">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-600"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {type === "move" ? t("moving") : t("copying")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <DialogFooter className="w-full flex items-center gap-4 justify-between">
          <Button
            onClick={handleConfirm}
            disabled={
              isLoadingFoldersList ||
              isErrorFoldersList ||
              !value ||
              !selectedDocs?.[0]?.id ||
              copyMoveMutation.isPending
            }
          >
            {copyMoveMutation.isPending ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {type === "move"
                  ? t("moving", { defaultValue: "جاري النقل..." })
                  : t("copying", { defaultValue: "جاري النسخ..." })}
              </div>
            ) : (
              t("save")
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={copyMoveMutation.isPending}
          >
            {t("cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
