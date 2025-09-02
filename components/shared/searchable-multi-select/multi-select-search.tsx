import React from 'react';
import { ChevronsUpDown, X } from 'lucide-react';
import { MultiSelectOption } from './types';

type MultiSelectSearchProps = {
  // Current search value
  value: string;
  // Handler for search value changes
  onChange: (value: string) => void;
  // Placeholder text
  placeholder?: string;
  // Whether dropdown is open
  isOpen: boolean;
  // Toggle dropdown open/closed
  onToggleOpen: () => void;
  // Optional focus handler
  onFocus?: () => void;
  // Optional disabled state
  disabled?: boolean;
  // Selected options
  selectedOptions?: MultiSelectOption[];
  // Handle removing an item
  onRemoveItem?: (value: string) => void;
}

/**
 * Search input component for the multi-select dropdown
 */
export function MultiSelectSearch({
  value,
  onChange,
  placeholder,
  isOpen,
  onToggleOpen,
  onFocus,
  disabled = false,
  selectedOptions = [],
  onRemoveItem,
}: MultiSelectSearchProps) {
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // Calculate if we should show placeholder
  const showPlaceholder = value === '' && selectedOptions.length === 0;
  
  return (
    <div className="relative">
      <div 
        className={`flex items-center flex-wrap gap-1 w-full min-h-[42px] px-3 py-1 border rounded-md 
                   focus-within:outline-none focus-within:ring-2 focus-within:ring-pink-500 
                   dark:bg-gray-800 dark:border-gray-700 
                   ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => !isOpen && !disabled && onToggleOpen()}
      >
        {/* Selected items */}
        {selectedOptions.map(option => (
          <div
            key={option.value}
            className="flex items-center gap-1 px-2 py-0.5 text-xs rounded-full 
                      bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300"
          >
            <span>{option.label}</span>
            {onRemoveItem && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent opening dropdown
                  onRemoveItem(option.value);
                }}
                className="rounded-full p-0.5 hover:bg-pink-200 dark:hover:bg-pink-800"
                aria-label={`Remove ${option.label}`}
                type="button"
              >
                <X size={12} />
              </button>
            )}
          </div>
        ))}
        
        {/* Input */}
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={onFocus}
          placeholder={showPlaceholder ? placeholder : ''}
          disabled={disabled}
          aria-expanded={isOpen}
          aria-controls="multi-select-dropdown"
          aria-label={placeholder || 'Search'}
          className="flex-1 min-w-[80px] bg-transparent border-none focus:outline-none focus:ring-0 dark:text-white"
        />
      </div>
      
      {/* Dropdown toggle button */}
      <button 
        className="absolute inset-y-0 right-0 flex items-center pr-2 
                   text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onToggleOpen}
        disabled={disabled}
        aria-label={isOpen ? 'Close dropdown' : 'Open dropdown'}
        tabIndex={0}
        type="button"
      >
        <ChevronsUpDown size={16} />
      </button>
    </div>
  );
}
