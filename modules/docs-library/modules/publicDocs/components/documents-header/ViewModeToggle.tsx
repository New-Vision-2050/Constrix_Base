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
      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg",
          "bg-gray-700 border border-gray-600 text-white",
          "hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500",
          "transition-colors duration-200",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <ChevronDown className="h-4 w-4" />
        {getCurrentIcon()}
      </button>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10">
          <button
            type="button"
            onClick={() => handleModeSelect('grid')}
            className={cn(
              "flex items-center gap-2 w-full px-3 py-2 text-left text-white hover:bg-gray-700",
              "rounded-t-lg transition-colors duration-200",
              viewMode === 'grid' && "bg-blue-600 hover:bg-blue-700"
            )}
          >
            <Grid3X3 className="h-4 w-4" />
            <span>{t("grid")}</span>
          </button>
          <button
            type="button"
            onClick={() => handleModeSelect('list')}
            className={cn(
              "flex items-center gap-2 w-full px-3 py-2 text-left text-white hover:bg-gray-700",
              "rounded-b-lg transition-colors duration-200",
              viewMode === 'list' && "bg-blue-600 hover:bg-blue-700"
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
