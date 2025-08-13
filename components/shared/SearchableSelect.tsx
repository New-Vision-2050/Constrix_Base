import React, { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { Search } from 'lucide-react';

export interface Option {
  value: string | number;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  noResultsText?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  label?: string;
  name?: string;
  error?: string;
  defaultValue?: string | number;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  defaultValue,
  placeholder = 'اختر عنصر',
  searchPlaceholder = 'البحث...',
  noResultsText = 'لا توجد نتائج',
  disabled = false,
  className = '',
  required = false,
  label,
  name,
  error,
}) => {
  // Get current locale to handle RTL
  const locale = useLocale();
  const isRtl = locale === 'ar';
  
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Find the selected option to display
  const selectedOption = options.find(opt => opt.value === value);
  // Find default option if defaultValue is provided
  const defaultValueOption = defaultValue ? options.find(opt => opt.value === defaultValue) : undefined;
  
  // Filter options based on search term
  const filteredOptions = searchTerm
    ? options.filter(opt => 
        opt.label.toLowerCase().includes(searchTerm.toLowerCase()))
    : options;
    
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Base classes for consistent styling
  const baseInputClasses = `block w-full px-4 py-2 bg-gray-800 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${isRtl ? 'text-right' : 'text-left'}`;
  const baseDropdownClasses = 'absolute z-[9999] w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto';
  
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label 
          htmlFor={name} 
          className={`block mb-2 text-sm font-medium ${isRtl ? 'text-right' : 'text-left'} ${error ? 'text-red-500' : 'text-white'}`}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      {/* Selected value display / trigger */}
      <div 
        className={`${baseInputClasses} ${disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'} flex items-center justify-between`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={`block truncate ${!selectedOption ? 'text-gray-400' : 'text-white'}`}>
          {selectedOption ? selectedOption.label : (defaultValueOption?.label || placeholder)}
        </span>
        <svg 
          className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
      
      {/* Dropdown */}
      {isOpen && (
        <div className={baseDropdownClasses}>
          {/* Search input */}
          <div className="p-2 border-b border-gray-700">
            <div className="relative">
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                className={`${baseInputClasses} pl-10 py-1.5`}
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onClick={e => e.stopPropagation()}
                autoFocus
              />
            </div>
          </div>
          
          {/* Options */}
          <div>
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => (
                <div
                  key={option.value}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-700 ${option.value === value ? 'bg-pink-500 text-white' : 'text-gray-200'}`}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-400">{noResultsText}</div>
            )}
          </div>
        </div>
      )}
      
      {/* Error message */}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default SearchableSelect;
