import React from 'react';
import { Check } from 'lucide-react';
import { MultiSelectOption } from './types';
import { cn } from '@/lib/utils';

type MultiSelectItemProps = {
  // The option to render
  option: MultiSelectOption;
  // Whether this option is selected
  isSelected: boolean;
  // Function to handle selection toggle
  onToggle: (value: string) => void;
}

/**
 * Renders a single item in the multi-select dropdown
 */
export function MultiSelectItem({
  option,
  isSelected,
  onToggle,
}: MultiSelectItemProps) {
  // Handle click on the item
  const handleClick = () => {
    onToggle(option.value);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between px-3 py-2 cursor-pointer",
        "hover:bg-gray-100 dark:hover:bg-gray-700",
        isSelected ? "bg-pink-50 dark:bg-pink-900/30" : ""
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="option"
      aria-selected={isSelected}
      tabIndex={0}
    >
      <span className="text-sm">{option.label}</span>
      {isSelected && (
        <Check size={16} className="text-pink-500" aria-hidden="true" />
      )}
    </div>
  );
}
