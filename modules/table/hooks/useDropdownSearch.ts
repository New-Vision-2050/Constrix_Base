import { useState, useEffect, useCallback, useRef } from "react";
import {
  DropdownOption,
  DynamicDropdownConfig,
} from "@/modules/table/utils/tableTypes";
import { useDebounce } from "./useDebounce";
import { processApiResponse } from "@/modules/table/utils/dataUtils";
import { apiClient } from "@/config/axios-config";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface UseDropdownSearchProps {
  searchTerm: string;
  dynamicConfig?: DynamicDropdownConfig;
  dependencies?: Record<string, string | string[]>;
  selectedValue?: string | string[];
  isMulti?: boolean;
}

interface UseDropdownSearchResult {
  options: DropdownOption[];
  loading: boolean;
  error: string | null;
}

export const useDropdownSearch = ({
  searchTerm,
  dynamicConfig,
  dependencies,
  selectedValue,
  isMulti = false,
}: UseDropdownSearchProps): UseDropdownSearchResult => {
  const queryClient = useQueryClient();
  const [options, setOptions] = useState<DropdownOption[]>([]);
  const [backupOptions, setBackupOptions] = useState<DropdownOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  // Create a debounced search term
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);

  // Store the selected option(s) as backup when they change
  useEffect(() => {
    if (!selectedValue) return;

    if (isMulti && Array.isArray(selectedValue)) {
      // For multi-select, handle array of values
      const newBackupOptions: DropdownOption[] = [];

      selectedValue.forEach(value => {
        const selectedOption = options.find(option => option.value === value);
        if (selectedOption) {
          newBackupOptions.push(selectedOption);
        } else if (value) {
          newBackupOptions.push({ value, label: value });
        }
      });

      if (newBackupOptions.length > 0) {
        setBackupOptions(newBackupOptions);
      }
    } else if (!isMulti && typeof selectedValue === 'string') {
      // For single select, handle string value
      const selectedOption = options.find(option => option.value === selectedValue);
      if (selectedOption) {
        setBackupOptions([selectedOption]);
      } else if (selectedValue) {
        setBackupOptions([{ value: selectedValue, label: selectedValue }]);
      }
    }
  }, [selectedValue, options, isMulti]);

  // Build the URL for the request
  const buildSearchUrl = useCallback(() => {
    if (!dynamicConfig) return null;

    let url = dynamicConfig.url;
    const params = new URLSearchParams();

    // Add search parameter if configured and search term exists
    if (dynamicConfig.searchParam && debouncedSearchTerm) {
      params.append(dynamicConfig.searchParam, debouncedSearchTerm);
    }

    // Add dependency filter parameter if configured
    if (
      dynamicConfig.dependsOn &&
      dynamicConfig.filterParam &&
      dependencies &&
      dependencies[dynamicConfig.dependsOn]
    ) {
      const dependencyValue = dependencies[dynamicConfig.dependsOn];
      // Handle both string and string[] values
      const paramValue = Array.isArray(dependencyValue)
        ? dependencyValue.join(',')
        : dependencyValue;

      params.append(
        dynamicConfig.filterParam,
        paramValue
      );
    }

    // Add pagination parameters if enabled
    if (dynamicConfig.paginationEnabled) {
      const pageParam = dynamicConfig.pageParam || "page";
      const limitParam = dynamicConfig.limitParam || "per_page";
      const itemsPerPage = dynamicConfig.itemsPerPage || 10;

      params.append(pageParam, "1");
      params.append(limitParam, String(itemsPerPage));
    }

    // Append params to URL
    const queryString = params.toString();
    if (queryString) {
      url = `${url}${url.includes("?") ? "&" : "?"}${queryString}`;
    }

    return url;
  }, [dynamicConfig, debouncedSearchTerm, dependencies]);

  // Function to fetch options from the API
  const fetchOptions = useCallback(async () => {
    // Skip if we don't have dynamic config
    if (!dynamicConfig) return;

    // Skip if we have a dependsOn value but don't have the dependency
    if (
      dynamicConfig.dependsOn &&
      (!dependencies || !dependencies[dynamicConfig.dependsOn])
    ) {
      setOptions([]);
      return;
    }

    const url = buildSearchUrl();
    if (!url) return;

    // Abort any ongoing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new abort controller
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      // console.log(
      //   `Fetching dropdown options for search: ${debouncedSearchTerm}`,
      //   url
      // );
/*       const response = await apiClient.get(url, { signal: controller.signal });
 */
      const response = await queryClient.fetchQuery({
        queryKey: ["data", url],
        queryFn: async () => {
          const response = await apiClient.get(url);
          return response;
        },
        staleTime: 1000 * 60 * 5,
      });

      if (!isMountedRef.current) return;

      if (response.status !== 200) {
        throw new Error(`Failed to fetch options: ${response.status}`);
      }

      const data = processApiResponse(await response.data);
      if (!isMountedRef.current) return;

      if (!Array.isArray(data)) {
        throw new Error("Expected array response from API");
      }

      // Extract values and labels from the response
      const extractedOptions = data.map((item) => {
        const getValue = (obj: any, path: string) => {
          return path.split(".").reduce((acc, part) => acc && acc[part], obj);
        };

        return {
          value: String(getValue(item, dynamicConfig.valueField)),
          label: String(getValue(item, dynamicConfig.labelField)),
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

      // Merge the backup options with the new options if they exist and there is a selected value
      let mergedOptions = validOptions;

      if (selectedValue && backupOptions.length > 0) {
        // Add any backup options that aren't already in the results
        const optionsToAdd = backupOptions.filter(
          backupOpt => !mergedOptions.some(option => option.value === backupOpt.value)
        );

        if (optionsToAdd.length > 0) {
          mergedOptions = [...optionsToAdd, ...mergedOptions];
        }
      }

      setOptions(mergedOptions);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        console.log("Request aborted");
        return;
      }

      if (isMountedRef.current) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [dynamicConfig, dependencies, buildSearchUrl, debouncedSearchTerm]);

  // Fetch options when dependencies or search term change
  useEffect(() => {
    isMountedRef.current = true;
    fetchOptions();

    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchOptions, debouncedSearchTerm]);

  return {
    options,
    loading,
    error,
  };
};

// Helper function to create a debounced version of a value
function useDebouncedValue<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
