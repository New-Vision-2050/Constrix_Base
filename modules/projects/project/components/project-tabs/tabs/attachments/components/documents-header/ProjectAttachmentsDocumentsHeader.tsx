"use client";

import React, { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import SearchBar from "./SearchBar";
import ViewModeToggle from "./ViewModeToggle";
import type {
  ProjectAttachmentsDocumentsHeaderProps,
  ViewMode,
} from "./types";
import { Button } from "@/components/ui/button";
import {
  ArrowDownNarrowWide,
  Download,
  PanelLeftOpen,
  Upload,
  Folder,
  FileText,
  Ellipsis,
  Share2,
  Copy,
  Trash,
  Star,
  MoveRight,
  ArrowUpNarrowWide,
} from "lucide-react";
import { useProjectAttachmentsCxt } from "../../context/project-attachments-cxt";
import ProjectCreateNewDirDialog from "../../forms/create-dir/ProjectCreateNewDirDialog";
import { DropdownButton } from "@/components/shared/dropdown-button";
import ProjectCreateNewFileDialog from "../../forms/create-file/ProjectCreateNewFileDialog";
import { useTranslations } from "next-intl";
import ProjectCopyMoveDialog from "../../dialogs/ProjectCopyMoveDialog";
import ProjectShareDialog from "../../dialogs/ProjectShareDialog";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import { apiClient, baseURL } from "@/config/axios-config";
import { toast } from "sonner";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

const ProjectAttachmentsDocumentsHeader: React.FC<
  ProjectAttachmentsDocumentsHeaderProps
> = ({
  searchValue,
  onSearchChange,
  onAddClick: _onAddClick,
  viewMode = "grid",
  onViewModeChange,
  className = "",
  isLoading = false,
}) => {
  const t = useTranslations("docs-library.publicDocs.header");
  const { can } = usePermissions();
  const {
    sort,
    setSort,
    openDirDialog,
    setOpenDirDialog,
    openFileDialog,
    setOpenFileDialog,
    setEditedDoc,
    selectedDocs,
    refetchDocs,
    clearSelectedDocs,
    storeSelectedDocument,
    handleRefetchDocsWidgets,
  } = useProjectAttachmentsCxt();
  const [openDelete, setOpenDelete] = useState(false);
  const [cpMvDialogType, setcpMvDialogType] = useState<"copy" | "move">("copy");
  const [openCopyMoveDialog, setOpenCopyMoveDialog] = useState(false);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [showAdditionalBtns, setShowAdditionalBtns] = useState(false);

  const isDirectory = useMemo(
    () => !Boolean(selectedDocs?.[0]?.is_file),
    [selectedDocs],
  );

  const handleDelete = async () => {
    try {
      const _url =
        baseURL +
        (isDirectory
          ? `/folders/${selectedDocs?.[0]?.id}`
          : `/files/${selectedDocs?.[0]?.id}`);
      await apiClient.delete(_url);

      toast.success(t("deleteSuccess"));
      setOpenDelete(false);
      clearSelectedDocs();
      refetchDocs();
      if (!isDirectory) handleRefetchDocsWidgets();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const errorMsg = err?.response?.data?.message || err?.message;
      toast.error(errorMsg || t("deleteFailed"));
    }
  };

  const handleExport = async () => {
    try {
      const _url = baseURL + `/files/export`;
      const response = await apiClient.post(
        _url,
        {
          ids: selectedDocs?.map((doc) => doc.id),
        },
        {
          responseType: "blob",
        },
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `documents-export-${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("تم تصدير المستندات بنجاح");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const errorMsg = err?.response?.data?.message || err?.message;
      toast.error(errorMsg || "حدث خطأ أثناء تصدير المستندات");
    }
  };

  const handleDownload = async () => {
    try {
      const files = selectedDocs?.filter((doc) => Boolean(doc?.is_file));
      if (files?.length === 0) {
        toast.error("يجب اختيار ملف");
        return;
      }
      const _url = baseURL + `/files/download`;
      const response = await apiClient.post(
        _url,
        {
          ids: files?.map((doc) => doc.id),
        },
        {
          responseType: "blob",
        },
      );

      const blob = new Blob([response.data], {
        type: "application/zip",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const fileName =
        selectedDocs?.length === 1
          ? selectedDocs[0]?.name
          : `documents-${new Date().toISOString().split("T")[0]}.zip`;

      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("تم تحميل المستند بنجاح");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const errorMsg = err?.response?.data?.message || err?.message;
      toast.error(errorMsg || "حدث خطأ أثناء تحميل المستند");
    }
  };

  const handleFavorite = async () => {
    try {
      const files = selectedDocs?.filter((doc) => Boolean(doc?.is_file));
      if (files?.length === 0) {
        toast.error("يجب اختيار ملف");
        return;
      }
      const _url = baseURL + `/files/favourites`;
      await apiClient.post(_url, {
        ids: files?.map((doc) => doc.id),
      });
      toast.success("تم إضافة المستندات إلى المفضلة");
    } catch {
      toast.error("حدث خطأ أثناء إضافة المستندات إلى المفضلة");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 bg-sidebar">
        <div
          className={cn(
            "flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4",
            "bg-sidebar rounded-lg",
            className,
          )}
        >
          <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
            <SearchBar
              value={searchValue}
              onChange={onSearchChange}
              disabled={isLoading}
              placeholder={t("search")}
            />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <DropdownButton
              triggerButton={<Button>{t("add")}</Button>}
              items={[
                ...(can(PERMISSIONS.library.folder.create)
                  ? [
                      {
                        text: t("dir"),
                        icon: <Folder className="h-4 w-4" />,
                        onClick: () => {
                          setEditedDoc(undefined);
                          setOpenDirDialog(true);
                        },
                      },
                    ]
                  : []),
                ...(can(PERMISSIONS.library.file.create)
                  ? [
                      {
                        text: t("file"),
                        icon: <FileText className="h-4 w-4" />,
                        onClick: () => {
                          setEditedDoc(undefined);
                          setOpenFileDialog(true);
                        },
                      },
                    ]
                  : []),
              ]}
            />
            <Button
              onClick={() => setShowAdditionalBtns(!showAdditionalBtns)}
              variant="outline"
              className="bg-sidebar h-10"
              size="sm"
            >
              <Ellipsis className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="bg-sidebar h-10"
              size="sm"
              onClick={handleExport}
              disabled={!can(PERMISSIONS.library.file.export)}
            >
              <Upload className="mr-2 h-4 w-4" />
              {t("export")}
            </Button>
            <Button
              variant="outline"
              className="bg-sidebar h-10"
              size="sm"
              onClick={() => {
                setSort(sort === "asc" ? "desc" : "asc");
              }}
            >
              {sort === "asc" ? (
                <ArrowUpNarrowWide className="mr-2 h-4 w-4" />
              ) : (
                <ArrowDownNarrowWide className="mr-2 h-4 w-4" />
              )}
              {t("sort")}
            </Button>
            {onViewModeChange && (
              <ViewModeToggle
                viewMode={viewMode as ViewMode}
                onViewModeChange={onViewModeChange}
                disabled={isLoading}
              />
            )}
            <Button
              onClick={() => {
                storeSelectedDocument(selectedDocs[0]);
              }}
              variant="outline"
              className="bg-sidebar h-10"
              size="sm"
              disabled={selectedDocs.length != 1}
            >
              <PanelLeftOpen className="mr-2 h-4 w-4" />
              {t("details")}
            </Button>
          </div>
          <ProjectCreateNewDirDialog
            open={openDirDialog}
            onClose={() => setOpenDirDialog(false)}
          />
          <ProjectCreateNewFileDialog
            open={openFileDialog}
            onClose={() => setOpenFileDialog(false)}
          />
          <ProjectCopyMoveDialog
            open={openCopyMoveDialog}
            onClose={() => setOpenCopyMoveDialog(false)}
            type={cpMvDialogType}
          />
          <ProjectShareDialog
            open={openShareDialog}
            onClose={() => setOpenShareDialog(false)}
          />
        </div>
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            showAdditionalBtns ? "max-h-20 opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <div className="flex items-center justify-between p-4">
            <Button
              variant="outline"
              className="bg-sidebar h-10"
              size="sm"
              onClick={() => {
                setOpenShareDialog(true);
              }}
              disabled={
                selectedDocs?.length == 0 ||
                selectedDocs?.filter((doc) => !doc.is_file).length > 0
              }
            >
              <Share2 className="mr-2 h-4 w-4" />
              {t("share")}
            </Button>
            <Button
              variant="outline"
              className="bg-sidebar h-10"
              size="sm"
              onClick={() => {
                setcpMvDialogType("copy");
                setOpenCopyMoveDialog(true);
              }}
              disabled={
                selectedDocs?.length == 0 ||
                selectedDocs?.filter((doc) => !doc.is_file).length > 0 ||
                !can(PERMISSIONS.library.file.update)
              }
            >
              <Copy className="mr-2 h-4 w-4" />
              {t("copy")}
            </Button>
            <Button
              disabled
              variant="outline"
              className="bg-sidebar h-10"
              size="sm"
            >
              <FileText className="mr-2 h-4 w-4" />
              {t("requestFile")}
            </Button>
            <Button
              variant="outline"
              className="bg-sidebar h-10"
              size="sm"
              onClick={() => {
                setOpenDelete(true);
              }}
              disabled={
                selectedDocs?.length != 1 ||
                !Boolean(selectedDocs?.[0]?.can_delete) ||
                !can(PERMISSIONS.library.file.delete)
              }
            >
              <Trash className="mr-2 h-4 w-4" />
              {t("delete")}
            </Button>
            <Button
              variant="outline"
              onClick={handleDownload}
              className="bg-sidebar h-10"
              size="sm"
            >
              <Download className="mr-2 h-4 w-4" />
              {t("download")}
            </Button>
            <Button
              variant="outline"
              onClick={handleFavorite}
              className="bg-sidebar h-10"
              size="sm"
            >
              <Star className="mr-2 h-4 w-4" />
              {t("favorite")}
            </Button>
            <Button
              variant="outline"
              className="bg-sidebar h-10"
              size="sm"
              onClick={() => {
                setcpMvDialogType("move");
                setOpenCopyMoveDialog(true);
              }}
              disabled={
                selectedDocs?.length == 0 ||
                selectedDocs?.filter((doc) => !doc.is_file).length > 0 ||
                !can(PERMISSIONS.library.file.update)
              }
            >
              <MoveRight className="mr-2 h-4 w-4" />
              {t("move")}
            </Button>
          </div>
        </div>
      </div>
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

export default ProjectAttachmentsDocumentsHeader;
