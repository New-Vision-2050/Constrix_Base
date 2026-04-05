export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export type ViewMode = "grid" | "list";

export interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  className?: string;
  disabled?: boolean;
}

export interface ProjectAttachmentsDocumentsHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  className?: string;
  isLoading?: boolean;
}
