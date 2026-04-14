import React, { useState } from 'react';
import { ChevronDown, Grid3X3, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ViewModeToggleProps, ViewMode } from './types';
import { useTranslations } from 'next-intl';

/**
 * ViewModeToggle component for switching between grid and list view modes
 * Provides a dropdown-style button with view mode options
 */
const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  viewMode,
  onViewModeChange,
  className = '',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("docs-library.publicDocs.header")

  // Handle view mode selection
  const handleModeSelect = (mode: ViewMode) => {
    onViewModeChange(mode);
    setIsOpen(false);
  };

  // Get current view icon
  const getCurrentIcon = () => {
    return viewMode === 'grid' ? (
      <Grid3X3 className="h-4 w-4" />
    ) : (
      <List className="h-4 w-4" />
    );
  };

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg",
          "bg-muted border border-border text-foreground",
          "hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-primary",
          "transition-colors duration-200",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <ChevronDown className="h-4 w-4" />
        {getCurrentIcon()}
      </button>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-10">
          <button
            type="button"
            onClick={() => handleModeSelect('grid')}
            className={cn(
              "flex items-center gap-2 w-full px-3 py-2 text-left text-foreground hover:bg-muted",
              "rounded-t-lg transition-colors duration-200",
              viewMode === 'grid' && "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            <Grid3X3 className="h-4 w-4" />
            <span>{t("grid")}</span>
          </button>
          <button
            type="button"
            onClick={() => handleModeSelect('list')}
            className={cn(
              "flex items-center gap-2 w-full px-3 py-2 text-left text-foreground hover:bg-muted",
              "rounded-b-lg transition-colors duration-200",
              viewMode === 'list' && "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            <List className="h-4 w-4" />
            <span>{t("list")}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewModeToggle;
