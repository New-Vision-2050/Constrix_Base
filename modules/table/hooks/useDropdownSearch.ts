import { useState, useEffect, useCallback, useRef } from "react";

import { processApiResponse } from "@/modules/table/utils/dataUtils";
import { apiClient } from "@/config/axios-config";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DropdownOption, DynamicDropdownConfig } from "@/modules/form-builder";

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
  dataFetched: boolean;
  fetchOptions: (nextPage?: boolean) => void;
  hasMore: boolean;
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
  const [dataFetched, setDataFetched] = useState(false);
  const currentPage = useRef(1);
  const [hasMore, setHasMore] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);
  const initialFetchDoneRef = useRef(false);

  // Create a debounced search term
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);

  // Fetch label for initial value if needed
  useEffect(() => {
    const fetchInitialLabel = async () => {
      if (!dynamicConfig || !selectedValue || initialFetchDoneRef.current)
        return;

      // Skip if we already have the label in options
      if (isMulti && Array.isArray(selectedValue)) {
        const allLabelsFound = selectedValue.every((value) =>
          options.some(
            (option) => option.value === value && option.label !== value
          )
        );
        if (allLabelsFound) return;
      } else if (!isMulti && typeof selectedValue === "string") {
        const labelFound = options.some(
          (option) =>
            option.value === selectedValue && option.label !== selectedValue
        );
        if (labelFound) return;
      }

      try {
        setLoading(true);

        // Prepare values to fetch
        const valuesToFetch =
          isMulti && Array.isArray(selectedValue)
            ? selectedValue
            : [selectedValue as string];

        // Only fetch for values that don't already have proper labels
        const valuesToFetchFiltered = valuesToFetch.filter(
          (value) =>
            !options.some(
              (option) => option.value === value && option.label !== value
            )
        );

        if (valuesToFetchFiltered.length === 0) return;

        // Build URL with ID parameter
        let url = dynamicConfig.url;
        const params = new URLSearchParams();

        // Add ID parameter
        params.append(
          dynamicConfig.filterParam ??  dynamicConfig.valueField,
          valuesToFetchFiltered.join(",")
        );

        // Append params to URL
        const queryString = params.toString();
        if (queryString) {
          url = `${url}${url.includes("?") ? "&" : "?"}${queryString}`;
        }

        let response;
        if (dynamicConfig.disableReactQuery) {
          // Use direct API call without React Query
          response = await apiClient.get(url);
        } else {
          // Use React Query
          response = await queryClient.fetchQuery({
            queryKey: ["initialLabel", url],
            queryFn: async () => {
              const response = await apiClient.get(url);
              return response;
            },
            staleTime: 1000 * 60 * 5,
          });
        }

        if (!isMountedRef.current) return;

        if (response.status !== 200) {
          throw new Error(`Failed to fetch initial label: ${response.status}`);
        }

        const data = processApiResponse(await response.data);
        if (!isMountedRef.current) return;

        // Extract options from response
        let fetchedOptions: DropdownOption[] = [];

        if (Array.isArray(data)) {
          // Handle array response
          fetchedOptions = data.map((item) => {
            if (typeof item === "string" || typeof item === "number") {
              return {
                value: String(item),
                label: String(item),
              };
            }

            if (Array.isArray(item)) {
              const valueIndex = parseInt(dynamicConfig.valueField, 10);
              const labelIndex = parseInt(dynamicConfig.labelField, 10);

              if (
                !isNaN(valueIndex) &&
                !isNaN(labelIndex) &&
                valueIndex >= 0 &&
                labelIndex >= 0 &&
                valueIndex < item.length &&
                labelIndex < item.length
              ) {
                return {
                  value: String(item[valueIndex]),
                  label: String(item[labelIndex]),
                };
              }

              return {
                value: String(item[0] || ""),
                label: String(item[1] || item[0] || ""),
              };
            }

            // Handle object format
            const getValue = (obj: any, path: string) => {
              return path
                .split(".")
                .reduce((acc, part) => acc && acc[part], obj);
            };

            return {
              value: String(getValue(item, dynamicConfig.valueField)),
              label: String(getValue(item, dynamicConfig.labelField)),
            };
          });
        } else if (data && typeof data === "object") {
          // Handle single object response
          const getValue = (obj: any, path: string) => {
            return path.split(".").reduce((acc, part) => acc && acc[part], obj);
          };

          fetchedOptions = [
            {
              value: String(getValue(data, dynamicConfig.valueField)),
              label: String(getValue(data, dynamicConfig.labelField)),
            },
          ];
        }

        // Filter valid options
        const validOptions = fetchedOptions.filter(
          (opt) => opt.value && opt.value.trim() !== ""
        );

        if (validOptions.length > 0) {
          // Merge with existing options, avoiding duplicates
          setOptions((prevOptions) => {
            const newOptions = [...prevOptions];

            validOptions.forEach((newOpt) => {
              const existingIndex = newOptions.findIndex(
                (opt) => opt.value === newOpt.value
              );
              if (existingIndex >= 0) {
                newOptions[existingIndex] = newOpt;
              } else {
                newOptions.push(newOpt);
              }
            });

            return newOptions;
          });

          // Update backup options
          setBackupOptions((prevBackup) => {
            const newBackup = [...prevBackup];

            validOptions.forEach((newOpt) => {
              const existingIndex = newBackup.findIndex(
                (opt) => opt.value === newOpt.value
              );
              if (existingIndex >= 0) {
                newBackup[existingIndex] = newOpt;
              } else {
                newBackup.push(newOpt);
              }
            });

            return newBackup;
          });
        }

        initialFetchDoneRef.current = true;
      } catch (err) {
        console.error("Error fetching initial label:", err);
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchInitialLabel();
  }, [dynamicConfig, selectedValue, options, isMulti, queryClient]);

  // Store the selected option(s) as backup when they change
  useEffect(() => {
    if (!selectedValue) return;

    if (isMulti && Array.isArray(selectedValue)) {
      // For multi-select, handle array of values
      const newBackupOptions: DropdownOption[] = [];

      selectedValue.forEach((value) => {
        const selectedOption = options.find((option) => option.value === value);
        if (selectedOption) {
          newBackupOptions.push(selectedOption);
        } else if (value) {
          newBackupOptions.push({ value, label: value });
        }
      });

      if (newBackupOptions.length > 0) {
        setBackupOptions(newBackupOptions);
      }
    } else if (!isMulti && typeof selectedValue === "string") {
      // For single select, handle string value
      const selectedOption = options.find(
        (option) => option.value === selectedValue
      );
      if (selectedOption) {
        setBackupOptions([selectedOption]);
      } else if (selectedValue) {
        setBackupOptions([{ value: selectedValue, label: selectedValue }]);
      }
    }
  }, [selectedValue, options, isMulti]);

  // Build the URL for the request
  const buildSearchUrl = useCallback(
    (nextPage?: boolean) => {
      if (!dynamicConfig) return null;

      let url = dynamicConfig.url;
      const params = new URLSearchParams();
      // Add search parameter if configured and search term exists
      if (dynamicConfig.searchParam && debouncedSearchTerm) {
        params.append(dynamicConfig.searchParam, debouncedSearchTerm);
      }

      // Handle dependency parameters
      if (dynamicConfig.dependsOn && dependencies) {
        // Case 1: String format (backward compatibility)
        if (typeof dynamicConfig.dependsOn === "string") {
          if (
            dynamicConfig.filterParam &&
            dependencies[dynamicConfig.dependsOn]
          ) {
            const dependencyValue = dependencies[dynamicConfig.dependsOn];
            // Handle both string and string[] values
            const paramValue = Array.isArray(dependencyValue)
              ? dependencyValue.join(",")
              : dependencyValue;

            params.append(dynamicConfig.filterParam, paramValue);
          }
        }
        // Case 2: Array of dependency configs
        else if (Array.isArray(dynamicConfig.dependsOn)) {
          for (const depConfig of dynamicConfig.dependsOn) {
            if (dependencies[depConfig.field]) {
              const dependencyValue = dependencies[depConfig.field];
              const paramValue = Array.isArray(dependencyValue)
                ? dependencyValue.join(",")
                : dependencyValue;

              if (depConfig.method === "replace") {
                // Replace placeholders in URL
                const placeholder = `{${depConfig.field}}`;
                url = url.replace(placeholder, encodeURIComponent(paramValue));
              } else if (depConfig.method === "query") {
                // Add as query parameter
                const paramName = depConfig.paramName || depConfig.field;
                params.append(paramName, paramValue);
              }
            }
          }
        }
        // Case 3: Object with field names as keys
        else if (typeof dynamicConfig.dependsOn === "object") {
          for (const [field, config] of Object.entries(
            dynamicConfig.dependsOn
          )) {
            if (dependencies[field]) {
              const dependencyValue = dependencies[field];
              const paramValue = Array.isArray(dependencyValue)
                ? dependencyValue.join(",")
                : dependencyValue;

              if (config.method === "replace") {
                // Replace placeholders in URL
                const placeholder = `{${field}}`;
                url = url.replace(placeholder, encodeURIComponent(paramValue));
              } else if (config.method === "query") {
                // Add as query parameter
                const paramName = config.paramName || field;
                params.append(paramName, paramValue);
              }
            }
          }
        }
      }

      // Add pagination parameters if enabled
      if (dynamicConfig.paginationEnabled) {
        const pageParam = dynamicConfig.pageParam || "page";
        const limitParam = dynamicConfig.limitParam || "per_page";
        const itemsPerPage = dynamicConfig.itemsPerPage || 10;

        params.append(
          pageParam,
          String(nextPage ? currentPage.current + 1 : 1)
        );
        params.append(limitParam, String(itemsPerPage));
        if (nextPage) {
          currentPage.current++;
        } else {
          currentPage.current = 1;
        }
      }

      // Append params to URL
      const queryString = params.toString();
      if (queryString) {
        url = `${url}${url.includes("?") ? "&" : "?"}${queryString}`;
      }

      return url;
    },
    [dynamicConfig, debouncedSearchTerm, dependencies]
  );

  // Function to fetch options from the API
  const fetchOptions = useCallback(
    async (nextPage?: boolean) => {
      // Skip if we don't have dynamic config
      if (!dynamicConfig) return;

      // Skip if we have a dependsOn value but don't have the required dependencies
      if (dynamicConfig.dependsOn && !nextPage) {
        if (typeof dynamicConfig.dependsOn === "string") {
          // Case 1: String format (backward compatibility)
          if (!dependencies || !dependencies[dynamicConfig.dependsOn]) {
            setOptions([]);
            return;
          }
        } else if (Array.isArray(dynamicConfig.dependsOn)) {
          // Case 2: Array of dependency configs
          // Check if any required dependency is missing
          const missingDependency = dynamicConfig.dependsOn.some(
            (depConfig) => !dependencies || !dependencies[depConfig.field]
          );
          if (missingDependency) {
            setOptions([]);
            return;
          }
        } else if (typeof dynamicConfig.dependsOn === "object") {
          // Case 3: Object with field names as keys
          // Check if any required dependency is missing
          const missingDependency = Object.keys(dynamicConfig.dependsOn).some(
            (field) => !dependencies || !dependencies[field]
          );
          if (missingDependency) {
            setOptions([]);
            return;
          }
        }
      }

      const url = buildSearchUrl(nextPage);
      if (!url) return;

      // Abort any ongoing requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create a new abort controller
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setLoading(true);
      setDataFetched(false);
      setError(null);

      try {
        // console.log(
        //   `Fetching dropdown options for search: ${debouncedSearchTerm}`,
        //   url
        // );
        let response;
      if (dynamicConfig.disableReactQuery) {
        // Use direct API call without React Query
        response = await apiClient.get(url, { signal: controller.signal });
      } else {
        // Use React Query
        response = await queryClient.fetchQuery({
          queryKey: ["data", url],
          queryFn: async () => {
            const response = await apiClient.get(url);
            return response;
          },
          staleTime: 1000 * 60 * 5,
        });
      }

        if (!isMountedRef.current) return;

        if (response.status !== 200) {
          throw new Error(`Failed to fetch options: ${response.status}`);
        }


        const data = processApiResponse(await response.data);
        if (!isMountedRef.current) return;

        if (!Array.isArray(data)) {
          throw new Error("Expected array response from API");
        }

        
  if (dynamicConfig.paginationEnabled) {
        setHasMore(response.data.pagination?.last_page > response.data.pagination?.page)
      }
      // Extract values and labels from the response
      const extractedOptions = data.map((item) => {
        // Handle primitive values (string, number)
        if (typeof item === 'string' || typeof item === 'number') {
          // For primitive values, use the value as both value and label
          return {
            value: String(item),
            label: String(item),
          };
        }          // Handle array format [value, label]
          if (Array.isArray(item)) {
            // If item is an array, use indices as valueField and labelField
            // For example, if valueField is "0" and labelField is "1", use item[0] as value and item[1] as label
            const valueIndex = parseInt(dynamicConfig.valueField, 10);
            const labelIndex = parseInt(dynamicConfig.labelField, 10);

            if (
              !isNaN(valueIndex) &&
              !isNaN(labelIndex) &&
              valueIndex >= 0 &&
              labelIndex >= 0 &&
              valueIndex < item.length &&
              labelIndex < item.length
            ) {
              return {
                value: String(item[valueIndex]),
                label: String(item[labelIndex]),
              };
            }

            // Fallback to first element as value and second as label if indices are invalid
            return {
              value: String(item[0] || ""),
              label: String(item[1] || item[0] || ""),
            };
          }

          // Handle object format
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

        if (selectedValue && backupOptions.length > 0 && !nextPage) {
          // Add any backup options that aren't already in the results
          const optionsToAdd = backupOptions.filter(
            (backupOpt) =>
              !mergedOptions.some((option) => option.value === backupOpt.value)
          );

          if (optionsToAdd.length > 0) {
            mergedOptions = [...optionsToAdd, ...mergedOptions];
          }
        }

        setOptions((prev) =>
          nextPage ? [...prev, ...mergedOptions] : mergedOptions
        );
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
          setDataFetched(true);
        }
      }
    },
    [dynamicConfig, dependencies, buildSearchUrl, debouncedSearchTerm]
  );

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
    dataFetched,
    fetchOptions,
    hasMore,
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
