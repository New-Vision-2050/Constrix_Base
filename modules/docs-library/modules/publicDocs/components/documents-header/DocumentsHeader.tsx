import React, { useState } from "react";
import { cn } from "@/lib/utils";
import SearchBar from "./SearchBar";
import ViewModeToggle from "./ViewModeToggle";
import { DocumentsHeaderProps } from "./types";
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
} from "lucide-react";
import { usePublicDocsCxt } from "../../contexts/public-docs-cxt";
import CreateNewDirDialogContent from "../../views/public-docs-tab/create-new-dir/DialogContent";
import { DropdownButton } from "@/components/shared/dropdown-button";
import CreateNewFileDialog from "../../views/public-docs-tab/create-new-file/CreateNewFileDialog";
import { useTranslations } from "next-intl";
import CopyMoveDialog from "../../views/public-docs-tab/copy-move-dialog";
import ShareDialog from "../../views/public-docs-tab/share-dialog";

/**
 * DocumentsHeader component for document management interface
 * Combines search bar, add button, and action buttons in a unified header
 * Follows SOLID principles with single responsibility for header controls
 */
const DocumentsHeader: React.FC<DocumentsHeaderProps> = ({
  searchValue,
  onSearchChange,
  onAddClick,
  viewMode = "grid",
  onViewModeChange,
  className = "",
  isLoading = false,
}) => {
  const t = useTranslations("docs-library.publicDocs.header");
  const { toggleShowItemDetials } = usePublicDocsCxt();
  const [openDirDialog, setOpenDirDialog] = useState(false);
  const [openFileDialog, setOpenFileDialog] = useState(false);
  const [cpMvDialogType, setcpMvDialogType] = useState<"copy" | "move">("copy");
  const [openCopyMoveDialog, setOpenCopyMoveDialog] = useState(false);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [showAdditionalBtns, setShowAdditionalBtns] = useState(false);

  return (
    <div className="flex flex-col gap-4 bg-sidebar">
      <div
        className={cn(
          "flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4",
          "bg-sidebar rounded-lg",
          className
        )}
      >
        {/* Left side: Search bar and Add button */}
        <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
            disabled={isLoading}
            placeholder={t("search")}
          />
        </div>
        {/* Right side: Action buttons and View Mode Toggle */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Add button */}
          <DropdownButton
            triggerButton={<Button>{t("add")}</Button>}
            items={[
              {
                text: t("dir"),
                icon: <Folder className="h-4 w-4" />,
                onClick: () => setOpenDirDialog(true),
              },
              {
                text: t("file"),
                icon: <FileText className="h-4 w-4" />,
                onClick: () => setOpenFileDialog(true),
              },
            ]}
          />
          {/* more button */}
          <Button
            onClick={() => setShowAdditionalBtns(!showAdditionalBtns)}
            variant="outline"
            className="bg-sidebar h-10"
            size="sm"
          >
            <Ellipsis className="h-4 w-4" />
          </Button>
          {/* Export button */}
          <Button variant="outline" className="bg-sidebar h-10" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            {t("export")}
          </Button>
          {/* Sort button */}
          <Button variant="outline" className="bg-sidebar h-10" size="sm">
            <ArrowDownNarrowWide className="mr-2 h-4 w-4" />
            {t("sort")}
          </Button>
          {/* View Mode Toggle */}
          {onViewModeChange && (
            <ViewModeToggle
              viewMode={viewMode}
              onViewModeChange={onViewModeChange}
              disabled={isLoading}
            />
          )}
          {/* Details button */}
          <Button
            onClick={toggleShowItemDetials}
            variant="outline"
            className="bg-sidebar h-10"
            size="sm"
          >
            <PanelLeftOpen className="mr-2 h-4 w-4" />
            {t("details")}
          </Button>
        </div>
        <CreateNewDirDialogContent
          open={openDirDialog}
          onClose={() => setOpenDirDialog(false)}
        />
        <CreateNewFileDialog
          open={openFileDialog}
          onClose={() => setOpenFileDialog(false)}
        />
        <CopyMoveDialog
          open={openCopyMoveDialog}
          onClose={() => setOpenCopyMoveDialog(false)}
          type={cpMvDialogType}
        />
        <ShareDialog
          open={openShareDialog}
          onClose={() => setOpenShareDialog(false)}
        />
      </div>
      {/* Additional actions with slide down animation */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          showAdditionalBtns ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="flex items-center justify-between p-4">
          {/* share button */}
          <Button
            variant="outline"
            className="bg-sidebar h-10"
            size="sm"
            onClick={() => {
              setOpenShareDialog(true);
            }}
          >
            <Share2 className="mr-2 h-4 w-4" />
            {t("share")}
          </Button>
          {/* copy button */}
          <Button
            variant="outline"
            className="bg-sidebar h-10"
            size="sm"
            onClick={() => {
              setcpMvDialogType("copy");
              setOpenCopyMoveDialog(true);
            }}
          >
            <Copy className="mr-2 h-4 w-4" />
            {t("copy")}
          </Button>
          {/* request file button */}
          <Button variant="outline" className="bg-sidebar h-10" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            {t("requestFile")}
          </Button>
          {/* delete button */}
          <Button variant="outline" className="bg-sidebar h-10" size="sm">
            <Trash className="mr-2 h-4 w-4" />
            {t("delete")}
          </Button>
          {/* download button */}
          <Button variant="outline" className="bg-sidebar h-10" size="sm">
            <Download className="mr-2 h-4 w-4" />
            {t("download")}
          </Button>
          {/* favorite button */}
          <Button variant="outline" className="bg-sidebar h-10" size="sm">
            <Star className="mr-2 h-4 w-4" />
            {t("favorite")}
          </Button>
          {/* move button */}
          <Button
            variant="outline"
            className="bg-sidebar h-10"
            size="sm"
            onClick={() => {
              setcpMvDialogType("move");
              setOpenCopyMoveDialog(true);
            }}
          >
            <MoveRight className="mr-2 h-4 w-4" />
            {t("move")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentsHeader;
