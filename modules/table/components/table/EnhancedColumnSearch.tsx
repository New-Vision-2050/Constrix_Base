
import React, { useState, useEffect } from 'react';
import { Input } from "@/modules/table/components/ui/input";
import { ColumnConfig } from '@/modules/table/utils/tableConfig';
import { ColumnSearchState, SearchTypeConfig } from '@/modules/table/utils/tableTypes';
import DropdownSearch from './DropdownSearch';
import { format } from 'date-fns';

interface EnhancedColumnSearchProps {
  columns: ColumnConfig[];
  columnSearchState: ColumnSearchState;
  onColumnSearch: (columnKey: string, value: string | string[]) => void;
}

const EnhancedColumnSearch: React.FC<EnhancedColumnSearchProps> = ({
  columns,
  columnSearchState,
  onColumnSearch,
}) => {
  const searchableColumns = columns.filter(col => col.searchable);
  const [searchTimeouts, setSearchTimeouts] = useState<Record<string, NodeJS.Timeout>>({});
  const [localInputValues, setLocalInputValues] = useState<Record<string, string | string[]>>({});

  // Initialize default values for date fields and other fields with defaultValue
  useEffect(() => {
    // Populate default values if provided
    if (columns && columns.length > 0) {
      const defaultValues: Record<string, string | string[]> = {};
      
      columns.forEach(field => {
        if (field.searchType?.defaultValue) {
          if (field.searchType.type === 'date' && field.searchType.defaultValue instanceof Date) {
            // Format date to YYYY-MM-DD
            const date = field.searchType.defaultValue;
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            defaultValues[field.key] = `${year}-${month}-${day}`;
          } else {
            // Convert number or other types to string for compatibility
            defaultValues[field.key] = String(field.searchType.defaultValue);
          }
        }
      });
      
      // Only update if there are default values and they're not already set
      if (Object.keys(defaultValues).length > 0) {
        setLocalInputValues(prev => ({
          ...prev,
          ...defaultValues
        }));
        
        // Apply default values to column search state
        Object.entries(defaultValues).forEach(([key, value]) => {
          onColumnSearch(key, value);
        });
      }
    }
  }, []); // Solo ejecutar en el montaje inicial
  
  // Update local input values when columnSearchState changes
  useEffect(() => {
    // Create a map of local values from the global state
    const newLocalValues: Record<string, string | string[]> = {};
    
    // Copy current values from columnSearchState
    if (columnSearchState) {
      Object.keys(columnSearchState).forEach((key) => {
        newLocalValues[key] = columnSearchState[key];
      });
    }
    
    // Update local state, but don't override with empty values if we have local values
    setLocalInputValues(prev => {
      const merged = { ...prev };
      Object.entries(newLocalValues).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          merged[key] = value;
        }
      });
      return merged;
    });
  }, [columnSearchState]);

  // Track dependencies between dropdowns
  const getDependencyValues = () => {
    const dependencies: Record<string, string | string[]> = {};
    searchableColumns.forEach(column => {
      if (column.key in columnSearchState) {
        dependencies[column.key] = columnSearchState[column.key];
      }
    });
    return dependencies;
  };
  
  const handleSearchChange = (columnKey: string, value: string | string[]) => {
    // Clear any existing timeout for this column
    if (searchTimeouts[columnKey]) {
      clearTimeout(searchTimeouts[columnKey]);
    }
    
    // For immediate changes (like dropdowns), don't debounce
    const searchType = searchableColumns.find(col => col.key === columnKey)?.searchType?.type;
    if (searchType === 'dropdown') {
      onColumnSearch(columnKey, value);
      return;
    }
    
    // Debounce text input searches
    const timeout = setTimeout(() => {
      onColumnSearch(columnKey, value);
      
      // Clean up the timeout reference
      setSearchTimeouts(prev => {
        const updated = { ...prev };
        delete updated[columnKey];
        return updated;
      });
    }, 500);
    
    // Store the timeout reference
    setSearchTimeouts(prev => ({
      ...prev,
      [columnKey]: timeout
    }));
  };
  
  if (searchableColumns.length === 0) {
    return null;
  }
  
  const dependencies = getDependencyValues();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
      {searchableColumns.map(column => {
        const searchType = column.searchType || { type: 'text' };
        const value = columnSearchState[column.key] || '';
        
        switch (searchType.type) {
          case 'dropdown':
            return (
              <DropdownSearch
                key={column.key}
                columnKey={column.key}
                label={column.label}
                value={value}
                isMulti={column.searchType?.isMulti || false}
                onChange={(newValue) => handleSearchChange(column.key, newValue)}
                options={searchType.dropdownOptions}
                dynamicConfig={searchType.dynamicDropdown}
                dependencies={dependencies}
                placeholder={searchType.placeholder || `Search ${column.label}...`}
              />
            );
            
          case 'date':
            return (
              <div key={column.key} className="space-y-1">
                <label 
                  htmlFor={`search-${column.key}`} 
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {column.label}
                </label>
                <Input
                  id={`search-${column.key}`}
                  type="date"
                  placeholder={searchType.placeholder || `Select ${column.label}...`}
                  value={typeof value === 'string' ? value : ''}
                  onChange={(e) => handleSearchChange(column.key, e.target.value)}
                  className="w-full"
                />
              </div>
            );
          
          case 'text':
          default:
            return (
              <div key={column.key} className="space-y-1">
                <label 
                  htmlFor={`search-${column.key}`} 
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {column.label}
                </label>
                <Input
                  id={`search-${column.key}`}
                  type="text"
                  placeholder={searchType.placeholder || `Search ${column.label}...`}
                  value={value}
                  onChange={(e) => handleSearchChange(column.key, e.target.value)}
                  className="w-full"
                />
              </div>
            );
        }
      })}
    </div>
  );
};

export default EnhancedColumnSearch;
