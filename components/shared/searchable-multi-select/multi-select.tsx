import React, { useState, useEffect, useRef } from 'react';
import { MultiSelectOption, SearchableMultiSelectProps } from './types';
import { MultiSelectItem } from './multi-select-item';
import { MultiSelectSearch } from './multi-select-search';
import { SelectedItems } from './selected-items';
import { cn } from '@/lib/utils';

/**
 * Searchable multi-select component
 */
export function SearchableMultiSelect({
  options,
  selectedValues,
  onChange,
  placeholder = 'Search...',
  disabled = false,
  className,
}: SearchableMultiSelectProps) {
  // State for search input
  const [searchTerm, setSearchTerm] = useState('');
  // State for dropdown visibility
  const [isOpen, setIsOpen] = useState(false);
  // Ref for the component container
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Debug logging for dropdown state
  console.log('SearchableMultiSelect rendering, isOpen:', isOpen);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle selection toggle
  const handleToggle = (value: string) => {
    onChange(
      selectedValues.includes(value)
        ? selectedValues.filter(v => v !== value)
        : [...selectedValues, value]
    );
  };
  
  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    
    // Open dropdown when typing
    if (value && !isOpen) {
      console.log('Search input changed, opening dropdown');
      setIsOpen(true);
    }
  };

  // Handle input focus to open dropdown
  const handleInputFocus = () => {
    if (!isOpen) {
      console.log('Input focused, opening dropdown');
      setIsOpen(true);
    }
  };
  
  // Toggle dropdown open/closed
  const toggleDropdown = () => {
    console.log('Toggle dropdown called, current state:', isOpen, 'new state:', !isOpen);
    setIsOpen(!isOpen);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        console.log('Click outside detected, closing dropdown');
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <MultiSelectSearch
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder={placeholder}
        isOpen={isOpen}
        onToggleOpen={toggleDropdown}
        onFocus={handleInputFocus}
        disabled={disabled}
        selectedOptions={options.filter(option => selectedValues.includes(option.value))}
        onRemoveItem={handleToggle}
      />
      
      {/* Dropdown menu */}
      {isOpen && filteredOptions.length > 0 && (
        <div 
          id="multi-select-dropdown"
          className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto dark:bg-gray-800 dark:border dark:border-gray-700"
          role="listbox"
          aria-multiselectable="true"
          aria-label={placeholder}
        >
          {filteredOptions.map(option => (
            <MultiSelectItem
              key={option.value}
              option={option}
              isSelected={selectedValues.includes(option.value)}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
