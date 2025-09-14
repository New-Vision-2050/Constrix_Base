import React, { memo, useEffect, useState, useRef, useCallback } from "react";
import Select, { MultiValue, components } from "react-select";
import { FieldConfig, DropdownOption } from "../../types/formTypes";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { Label } from "@/modules/table/components/ui/label";
import { apiClient } from "@/config/axios-config";

interface MultiSelectFieldProps {
  field: FieldConfig;
  value: string[];
  error?: string | React.ReactNode;
  touched?: boolean;
  onChange: (value: string[]) => void;
  onBlur: () => void;
  dependencyValues?: Record<string, any>;
}

// Custom Input component with search icon
const CustomInput = (props: any) => (
  <components.Input {...props} className="text-sm" autoComplete="off" />
);

// Custom Menu component with loading indicator
const CustomMenu = (props: any) => (
  <components.Menu {...props}>
    {props.children}
    {props.selectProps.isLoading && (
      <div className="flex items-center justify-center py-2 text-sm text-muted-foreground">
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Loading options...
      </div>
    )}
  </components.Menu>
);

// Custom NoOptionsMessage component
const CustomNoOptionsMessage = (props: any) => (
  <components.NoOptionsMessage {...props}>
    <div className="flex items-center justify-center text-sm text-muted-foreground">
      <Search className="mr-2 h-4 w-4" />
      No options found
    </div>
  </components.NoOptionsMessage>
);

const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  field,
  value = [],
  error,
  touched,
  onChange,
  onBlur,
  dependencyValues = {},
}) => {
  const [options, setOptions] = useState<DropdownOption[]>(field.options || []);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Convert string array to react-select format
  const selectedOptions = options.filter((option) =>
    value.includes(option.value)
  );

  // Handle dynamic options loading
  useEffect(() => {
    if (!field.dynamicOptions) return;

    // Load initial options
    fetchOptions("");
  }, [field.dynamicOptions, dependencyValues]);

  // Custom debounce hook
  const useDebounce = (fn: Function, delay: number) => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const debouncedFn = useCallback(
      (...args: any[]) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          fn(...args);
        }, delay);
      },
      [fn, delay]
    );

    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    return debouncedFn;
  };

  // Debounced search function
  const debouncedSearch = useDebounce((searchTerm: string) => {
    if (field.dynamicOptions) {
      fetchOptions(searchTerm);
    }
  }, 300);

  // Handle input change for search
  const handleInputChange = (inputValue: string) => {
    setInputValue(inputValue);
    debouncedSearch(inputValue);
  };

  // Fetch options from API
  const fetchOptions = async (searchTerm: string) => {
    if (!field.dynamicOptions) return;

    const { url, valueField, labelField, dependsOn, filterParam } = field.dynamicOptions;
    // Use searchParam if it exists and has a value, otherwise use valueField
    const searchParamFinal = (typeof field.dynamicOptions.searchParam === 'string' && field.dynamicOptions.searchParam.trim() !== '')
      ? field.dynamicOptions.searchParam
      : labelField;

    // Skip if we have a dependency but no value for it
    if (dependsOn) {
      // Handle different types of dependsOn
      if (typeof dependsOn === 'string') {
        // String dependency
        if (!dependencyValues || !dependencyValues[dependsOn]) {
          setOptions([]);
          return;
        }
      } else if (Array.isArray(dependsOn)) {
        // Array of dependencies - if any dependency is missing, skip
        const missingDependency = dependsOn.some(
          (dep) => !dependencyValues || !dependencyValues[dep.field]
        );
        if (missingDependency) {
          setOptions([]);
          return;
        }
      } else {
        // Object with field keys - if any dependency is missing, skip
        const missingDependency = Object.keys(dependsOn).some(
          (field) => !dependencyValues || !dependencyValues[field]
        );
        if (missingDependency) {
          setOptions([]);
          return;
        }
      }
    }

    try {
      setIsLoading(true);

      // Build URL with parameters
      let apiUrl = url;
      const params = new URLSearchParams();

      // Add search parameter if provided
      if (searchParamFinal && searchTerm) {
        params.append(searchParamFinal, searchTerm);
      }

      // Add dependency filter if configured
      if (dependsOn && filterParam) {
        if (typeof dependsOn === 'string' && dependencyValues[dependsOn]) {
          params.append(filterParam, dependencyValues[dependsOn]);
        } else if (Array.isArray(dependsOn)) {
          // Handle array of dependencies
          dependsOn.forEach(dep => {
            if (dependencyValues[dep.field]) {
              const paramName = dep.paramName || dep.field;
              params.append(paramName, dependencyValues[dep.field]);
            }
          });
        } else {
          // Handle object with field keys
          Object.entries(dependsOn).forEach(([field, config]) => {
            if (dependencyValues[field]) {
              const paramName = config.paramName || field;
              params.append(paramName, dependencyValues[field]);
            }
          });
        }
      }

      // Add pagination parameters if enabled
      if (field.dynamicOptions.paginationEnabled) {
        const pageParam = field.dynamicOptions.pageParam || "page";
        const limitParam = field.dynamicOptions.limitParam || "per_page";
        const itemsPerPage = field.dynamicOptions.itemsPerPage || 10;

        params.append(pageParam, "1");
        params.append(limitParam, String(itemsPerPage));
      }

      // Append params to URL
      const queryString = params.toString();
      if (queryString) {
        apiUrl = `${apiUrl}${apiUrl.includes("?") ? "&" : "?"}${queryString}`;
      }

      const response = await apiClient.get(apiUrl);

      if (!Array.isArray(response.data)) {
        throw new Error("Expected array response from API");
      }

      // Extract options from response
      const extractedOptions = response.data.map((item: any) => {
        const getValue = (obj: any, path: string) => {
          return path.split(".").reduce((acc, part) => acc && acc[part], obj);
        };

        return {
          value: String(getValue(item, valueField)),
          label: String(getValue(item, labelField)),
        };
      });

      // Filter out invalid options and remove duplicates
      const validOptions = extractedOptions
        .filter((opt) => opt.value && opt.value.trim() !== "")
        .reduce((acc: DropdownOption[], current) => {
          const x = acc.find((item) => item.value === current.value);
          if (!x) return acc.concat([current]);
          return acc;
        }, []);

      // Ensure selected options are included in the options list
      const mergedOptions = [...validOptions];

      // Add any selected options that aren't in the fetched options
      if (value && value.length > 0) {
        value.forEach((val) => {
          if (!mergedOptions.some((opt) => opt.value === val)) {
            // If we have a label for this value in the current options, use it
            const existingOption = options.find((opt) => opt.value === val);
            if (existingOption) {
              mergedOptions.push(existingOption);
            } else {
              // Otherwise just use the value as the label
              mergedOptions.push({ value: val, label: val });
            }
          }
        });
      }

      setOptions(mergedOptions);
      console.log('Auto-select all options', field.dynamicOptions.selectAll)
      console.log('Auto-select all mergedOptions', mergedOptions)

      // Auto-select all options if selectAll is enabled and no current selection
      if (field.dynamicOptions.selectAll && mergedOptions.length > 0) {
        const allValues = mergedOptions.map(option => option.value);
        onChange(allValues);
      }
    } catch (error) {
      console.log("Error fetching options:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle selection change
  const handleChange = (selectedOptions: MultiValue<DropdownOption>) => {
    const newValues = selectedOptions.map((option) => option.value);
    onChange(newValues);
  };

  return (
    <div className="space-y-2">
      {field.label && (
        <Label
          htmlFor={field.name}
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      <Select
        id={field.name}
        instanceId={field.name}
        isMulti
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        onBlur={onBlur}
        onInputChange={handleInputChange}
        inputValue={inputValue}
        isDisabled={field.disabled}
        isLoading={isLoading}
        placeholder={field.placeholder || "Select options..."}
        noOptionsMessage={() => "No options found"}
        components={{
          Input: CustomInput,
          Menu: CustomMenu,
          NoOptionsMessage: CustomNoOptionsMessage,
        }}
        classNames={{
          control: (state) =>
            cn(
              "bg-sidebar border border-input hover:border-ring rounded-md shadow-sm transition-colors px-3 py-1.5",
              state.isFocused
                ? "border-primary ring-2 ring-primary/20 ring-offset-1"
                : "",
              !!error && touched ? "border-destructive" : "",
              field.className
            ),
          menu: () =>
            "bg-background border border-input rounded-md shadow-lg mt-1 py-1 z-50",
          menuList: () => "py-1 max-h-60",
          option: (state) =>
            cn(
              "cursor-pointer px-3 py-2 text-sm transition-colors",
              state.isFocused ? "bg-accent text-accent-foreground" : "",
              state.isSelected
                ? "bg-primary text-primary-foreground font-medium"
                : ""
            ),
          multiValue: () => "bg-accent rounded-md mr-1 text-sm",
          multiValueLabel: () => "px-2 py-1",
          multiValueRemove: () =>
            "hover:bg-destructive hover:text-destructive-foreground rounded-tr-md rounded-br-md px-1",
          input: () => "text-foreground",
          placeholder: () => "text-muted-foreground",
          indicatorSeparator: () => "bg-input",
          dropdownIndicator: (state) =>
            cn(
              "text-muted-foreground hover:text-foreground transition-colors p-1",
              state.isFocused ? "text-primary" : ""
            ),
          clearIndicator: () =>
            "text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-accent/50 transition-colors",
          valueContainer: () => "gap-1",
          noOptionsMessage: () => "text-muted-foreground p-2 text-sm",
        }}
        unstyled
        className={cn("min-w-[200px]", field.width ? field.width : "w-full")}
      />

      {error && touched && (
        <div className="text-destructive text-sm mt-1">
          {typeof error === 'string' ? error : error}
        </div>
      )}

      {field.helperText && !error && (
        <p className="text-muted-foreground text-sm mt-1">{field.helperText}</p>
      )}
    </div>
  );
};

export default memo(MultiSelectField);
