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
  const { toggleShowItemDetials } = usePublicDocsCxt();
  const [openDirDialog, setOpenDirDialog] = useState(false);
  const [openFileDialog, setOpenFileDialog] = useState(false);

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
        />
      </div>
      {/* Right side: Action buttons and View Mode Toggle */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Add button */}
        <DropdownButton
          triggerButton={<Button>إضافة</Button>}
          items={[
            {
              text: "مجلد",
              onClick: () => setOpenDirDialog(true),
            },
            {
              text: "ملف",
              onClick: () => setOpenFileDialog(true),
            },
          ]}
        />
        {/* Export button */}
        <Button variant="outline" className="bg-sidebar h-10" size="sm">
          <Download className="mr-2 h-4 w-4" />
          تصدير
        </Button>
        {/* Sort button */}
        <Button variant="outline" className="bg-sidebar h-10" size="sm">
          <ArrowDownNarrowWide className="mr-2 h-4 w-4" />
          ترتيب
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
          تفاصيل
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
    </div>
  );
};

export default DocumentsHeader;
