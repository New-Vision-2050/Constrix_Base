import React from 'react';
import { X } from 'lucide-react';
import { MultiSelectOption } from './types';

type SelectedItemsProps = {
  // All available options for lookup
  options: MultiSelectOption[];
  // Currently selected values
  selectedValues: string[];
  // Function to remove an item (toggle selection)
  onRemove: (value: string) => void;
}

/**
 * Displays chips for the selected items
 */
export function SelectedItems({
  options,
  selectedValues,
  onRemove,
}: SelectedItemsProps) {
  // Get selected options with labels
  const selectedOptions = options.filter(option => 
    selectedValues.includes(option.value)
  );
  
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {selectedOptions.map(option => (
        <div 
          key={option.value}
          className="flex items-center gap-1 px-2 py-1 text-xs rounded-full 
                    bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300"
        >
          <span>{option.label}</span>
          <button 
            onClick={() => onRemove(option.value)}
            className="rounded-full p-0.5 hover:bg-pink-200 dark:hover:bg-pink-800"
            aria-label={`Remove ${option.label}`}
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}
