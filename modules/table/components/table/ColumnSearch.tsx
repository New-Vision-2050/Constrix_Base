import React, { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/modules/table/components/ui/input";
import { ColumnConfig } from "@/modules/table/utils/configs/columnConfig";
import {
  ColumnSearchState,
  SearchTypeConfig,
} from "@/modules/table/utils/tableTypes";
import DropdownSearch from "./DropdownSearch";
import { useDebounce } from "@/modules/table/hooks/useDebounce";
import { useTranslations } from "next-intl";
import { format } from "date-fns";

interface ColumnSearchProps {
  columns: ColumnConfig[];
  columnSearchState: ColumnSearchState;
  onColumnSearch: (columnKey: string, value: string | string[]) => void;
  allSearchedFields?: any[];
}

const ColumnSearch: React.FC<ColumnSearchProps> = ({
  columns,
  columnSearchState,
  onColumnSearch,
  allSearchedFields,
}) => {
  const t = useTranslations();
  const searchableColumns =
    allSearchedFields ?? columns.filter((col) => col.searchable);

  // Initialize local state with current column search values
  const [localInputValues, setLocalInputValues] = useState<Record<string, string | string[]>>({});

  // Initialize default values for date fields and other fields with defaultValue
  useEffect(() => {
    // Populate default values if provided
    if (allSearchedFields && allSearchedFields.length > 0) {
      const defaultValues: Record<string, string | string[]> = {};
      
      allSearchedFields.forEach(field => {
        if (field.searchType?.defaultValue) {
          if (field.searchType.type === 'date' && field.searchType.defaultValue instanceof Date) {
            // Format date to YYYY-MM-DD
            const date = field.searchType.defaultValue;
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            defaultValues[field.key] = `${year}-${month}-${day}`;
          } else {
            defaultValues[field.key] = field.searchType.defaultValue;
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

  // Create a debounced version of onColumnSearch
  const debouncedColumnSearch = useDebounce(
    (columnKey: string, value: string | string[]) => {
      onColumnSearch(columnKey, value);
    },
    500
  );

  // Create dependencies object for each dropdown
  const buildDependenciesMap = useCallback(() => {
    const dependenciesMap: Record<string, Record<string, string | string[]>> = {};

    searchableColumns.forEach((column) => {
      if (
        column.searchType?.type === "dropdown" &&
        column.searchType.dynamicDropdown?.dependsOn
      ) {
        const dependsOn = column.searchType.dynamicDropdown.dependsOn;

        dependenciesMap[column.key] = {
          [dependsOn]: columnSearchState[dependsOn] || "",
        };
      }
    });

    return dependenciesMap;
  }, [searchableColumns, columnSearchState]);

  // Get dependencies for each dropdown
  const dependenciesMap = buildDependenciesMap();

  // Log dependencies for debugging
  useEffect(() => {
    if (Object.keys(dependenciesMap).length > 0) {
      console.log("Current column search state:", columnSearchState);
      console.log("Dependent columns dependencies:", dependenciesMap);
    }
  }, [columnSearchState, dependenciesMap]);

  // Handle input change without immediately triggering the API call
  const handleInputChange = (columnKey: string, value: string | string[]) => {
    // Update local state immediately for responsive UI
    setLocalInputValues((prev) => ({
      ...prev,
      [columnKey]: value,
    }));

    // Trigger debounced search for text inputs
    debouncedColumnSearch(columnKey, value);
  };
  
  // Handle dropdown change - apply immediately without debounce
  const handleDropdownChange = (columnKey: string, value: string | string[]) => {
    // Update local state immediately for responsive UI
    setLocalInputValues((prev) => ({
      ...prev,
      [columnKey]: value,
    }));
    
    // Apply dropdown changes immediately without debounce
    onColumnSearch(columnKey, value);
    
    console.log(`Dropdown change applied for ${columnKey}:`, value);
  };

  if (searchableColumns.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="px-5 pt-5 font-medium text-xl">{t("Table.FilterSearch")}</h2>
      <div className="grid p-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4 ">
        {searchableColumns.map((column) => {
          const searchType = column.searchType || { type: "text" };
          const stateValue = columnSearchState[column.key] || "";
          // Use local value for text inputs to prevent lag
          const displayValue =
            localInputValues[column.key] !== undefined
              ? localInputValues[column.key]
              : stateValue;

          switch (searchType.type) {
            case "dropdown":
              return (
                <DropdownSearch
                  key={column.key}
                  columnKey={column.key}
                  label={column.label}
                  value={stateValue}
                  onChange={(newValue) => handleDropdownChange(column.key, newValue)}
                  options={searchType.dropdownOptions}
                  dynamicConfig={searchType.dynamicDropdown}
                  dependencies={dependenciesMap[column.key]}
                  placeholder={
                    searchType.placeholder ||
                    `Filter by ${column.label.toLowerCase()}`
                  }
                />
              );
            
            case "date":
              // Parse date constraints for validation
              const minDate = searchType.minDate ? new Date(searchType.minDate) : null;
              const maxDate = searchType.maxDate ? new Date(searchType.maxDate) : null;
              
              // For cross-field validation using maxDateField and minDateField from config
              let crossFieldConstraint: Date | null = null;
              
              // Check if there's a maxDateField property in the searchType
              if (searchType.maxDateField && columnSearchState[searchType.maxDateField]) {
                const maxFieldValue = columnSearchState[searchType.maxDateField];
                if (typeof maxFieldValue === 'string') {
                  crossFieldConstraint = new Date(maxFieldValue);
                  // Field constraint set
                }
              }
              
              // Check if there's a minDateField property in the searchType
              if (searchType.minDateField && columnSearchState[searchType.minDateField]) {
                const minFieldValue = columnSearchState[searchType.minDateField];
                if (typeof minFieldValue === 'string') {
                  crossFieldConstraint = new Date(minFieldValue);
                  // Field constraint set
                }
              }
              
              // Format dates for the min/max attributes
              const formatDateForInput = (date: Date) => {
                return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
              };

              // Determine the effective min and max dates considering both fixed constraints and cross-field constraints
              let effectiveMinDate = minDate;
              let effectiveMaxDate = maxDate;
              
              if (column.key === 'start_date' && crossFieldConstraint) {
                // For start_date, respect both maxDate and end_date (whichever is more restrictive)
                if (maxDate && crossFieldConstraint > maxDate) {
                  effectiveMaxDate = maxDate;
                } else if (crossFieldConstraint) {
                  effectiveMaxDate = crossFieldConstraint;
                }
              } else if (column.key === 'end_date' && crossFieldConstraint) {
                // For end_date, respect both minDate and start_date (whichever is more restrictive)
                if (minDate && crossFieldConstraint < minDate) {
                  effectiveMinDate = minDate;
                } else if (crossFieldConstraint) {
                  effectiveMinDate = crossFieldConstraint;
                }
              }

              return (
                <div key={column.key} className="text-right" dir="rtl">
                  {column.label ? (
                    <label
                      htmlFor={`search-${column.key}`}
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 w-full text-right mb-2 block"
                    >
                      {column.label}
                    </label>
                  ) : null}
                  <Input
                    id={`search-${column.key}`}
                    type="date"
                    placeholder={searchType.placeholder || `اختر ${column.label}`}
                    value={typeof displayValue === 'string' ? displayValue : ''}
                    onChange={(e) =>
                      handleInputChange(column.key, e.target.value)
                    }
                    style={{ textAlign: 'right' }}
                    className="w-full text-right"
                    dir="rtl"
                    min={effectiveMinDate ? formatDateForInput(effectiveMinDate) : undefined}
                    max={effectiveMaxDate ? formatDateForInput(effectiveMaxDate) : undefined}
                  />
                </div>
              );

            case "text":
            default:
              return (
                <div key={column.key}>
                  {column.label ? (
                    <label
                      htmlFor={`search-${column.key}`}
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"
                    >
                      {column.label}
                    </label>
                  ) : null}
                  <Input
                    id={`search-${column.key}`}
                    type="text"
                    placeholder={searchType.placeholder || `${column.label}`}
                    value={displayValue}
                    onChange={(e) =>
                      handleInputChange(column.key, e.target.value)
                    }
                    className="w-full"
                  />
                </div>
              );
          }
        })}
      </div>
    </div>
  );
};

export default React.memo(ColumnSearch);
