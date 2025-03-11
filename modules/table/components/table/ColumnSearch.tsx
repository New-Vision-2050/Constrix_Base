import React, { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/modules/table/components/ui/input";
import { ColumnConfig } from "@/modules/table/utils/configs/columnConfig";
import {
  ColumnSearchState,
  SearchTypeConfig,
} from "@/modules/table/utils/tableTypes";
import DropdownSearch from "./DropdownSearch";
import { useDebounce } from "@/modules/table/hooks/useDebounce";

interface ColumnSearchProps {
  columns: ColumnConfig[];
  columnSearchState: ColumnSearchState;
  onColumnSearch: (columnKey: string, value: string) => void;
  allSearchedFields?: any[];
}

const ColumnSearch: React.FC<ColumnSearchProps> = ({
  columns,
  columnSearchState,
  onColumnSearch,
  allSearchedFields,
}) => {
  const searchableColumns =
    allSearchedFields ?? columns.filter((col) => col.searchable);

  // Store local state for text inputs to prevent immediate API calls
  const [localInputValues, setLocalInputValues] = useState<ColumnSearchState>(
    {}
  );

  // Initialize local state with current search state
  useEffect(() => {
    setLocalInputValues(columnSearchState);
  }, []);

  // Create a debounced version of onColumnSearch
  const debouncedColumnSearch = useDebounce(
    (columnKey: string, value: string) => {
      onColumnSearch(columnKey, value);
    },
    500
  );

  // Create dependencies object for each dropdown
  const buildDependenciesMap = useCallback(() => {
    const dependenciesMap: Record<string, Record<string, string>> = {};

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
  const handleInputChange = (columnKey: string, value: string) => {
    // Update local state immediately for responsive UI
    setLocalInputValues((prev) => ({
      ...prev,
      [columnKey]: value,
    }));

    // Trigger debounced search
    debouncedColumnSearch(columnKey, value);
  };

  if (searchableColumns.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="px-5 pt-5 font-medium text-xl">فلتر البحث</h2>
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
                  onChange={(newValue) => onColumnSearch(column.key, newValue)}
                  options={searchType.dropdownOptions}
                  dynamicConfig={searchType.dynamicDropdown}
                  dependencies={dependenciesMap[column.key]}
                  placeholder={
                    searchType.placeholder ||
                    `Filter by ${column.label.toLowerCase()}`
                  }
                />
              );

            case "text":
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
