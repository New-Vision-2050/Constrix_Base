/**
 * Props for SearchBar component
 */
export interface SearchBarProps {
  /** Search query value */
  value: string;
  /** Handler for search query changes */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Optional custom className */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
}

/**
 * Props for AddButton component
 */
export interface AddButtonProps {
  /** Click handler */
  onClick: () => void;
  /** Button text */
  text?: string;
  /** Optional custom className */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
}



/**
 * View mode options
 */
export type ViewMode = 'grid' | 'list';

/**
 * Props for ViewModeToggle component
 */
export interface ViewModeToggleProps {
  /** Current view mode */
  viewMode: ViewMode;
  /** Handler for view mode changes */
  onViewModeChange: (mode: ViewMode) => void;
  /** Optional custom className */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
}

/**
 * Props for DocumentsHeader component
 */
export interface DocumentsHeaderProps {
  /** Search query value */
  searchValue: string;
  /** Handler for search query changes */
  onSearchChange: (value: string) => void;
  /** Handler for add button click */
  onAddClick: () => void;
  /** Current view mode */
  viewMode?: ViewMode;
  /** Handler for view mode changes */
  onViewModeChange?: (mode: ViewMode) => void;
  /** Optional custom className */
  className?: string;
  /** Loading state */
  isLoading?: boolean;
}
