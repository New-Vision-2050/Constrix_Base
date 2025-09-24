import React, { useState } from "react";
import { cn } from "@/lib/utils";
import SearchBar from "./SearchBar";
import ViewModeToggle from "./ViewModeToggle";
import { DocumentsHeaderProps } from "./types";
import { Button } from "@/components/ui/button";
import { ArrowDownNarrowWide, Download, PanelLeftOpen } from "lucide-react";
import { usePublicDocsCxt } from "../../contexts/public-docs-cxt";
import CreateNewDirDialogContent from "../../views/public-docs-tab/create-new-dir/DialogContent";
import { DropdownButton } from "@/components/shared/dropdown-button";
import CreateNewFileDialog from "../../views/public-docs-tab/create-new-file/CreateNewFileDialog";
import { useTranslations } from "next-intl";
import CopyMoveDialog from "../../views/public-docs-tab/copy-move-dialog";

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

  return (
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
              onClick: () => setOpenDirDialog(true),
            },
            {
              text: t("file"),
              onClick: () => setOpenFileDialog(true),
            },
          ]}
        />
        {/* Export button */}
        <Button
          variant="outline"
          className="bg-sidebar h-10"
          size="sm"
          onClick={() => {
            setcpMvDialogType("copy");
            setOpenCopyMoveDialog(true);
          }}
        >
          <Download className="mr-2 h-4 w-4" />
          {t("export")}
        </Button>
        {/* Sort button */}
        <Button
          variant="outline"
          className="bg-sidebar h-10"
          size="sm"
          onClick={() => {
            setcpMvDialogType("move");
            setOpenCopyMoveDialog(true);
          }}
        >
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
    </div>
  );
};

export default DocumentsHeader;
