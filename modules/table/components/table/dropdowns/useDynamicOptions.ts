import { useState, useEffect, useCallback, useRef } from "react";
import { DropdownOption } from "@/modules/table/utils/tableTypes";
import {
  DynamicDropdownConfig,
  getFetchUrl,
  extractDropdownOptions,
} from "./DropdownUtils";
import { useApiClient } from "@/utils/apiClient";
import axios, { AxiosError } from "axios";

interface UseDynamicOptionsProps {
  dynamicConfig?: DynamicDropdownConfig;
  dependencies?: Record<string, string | string[]>;
}

interface UseDynamicOptionsResult {
  options: DropdownOption[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export const useDynamicOptions = ({
  dynamicConfig,
  dependencies,
}: UseDynamicOptionsProps): UseDynamicOptionsResult => {
  const [options, setOptions] = useState<DropdownOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const previousDependenciesRef = useRef<Record<string, string | string[]>>({});
  const fetchControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);
  const fetchTimeoutRef = useRef<number | null>(null);
  const urlRef = useRef<string>("");
  const processingFetchRef = useRef(false);
  const apiClient = useApiClient();

  // Function to manually trigger a refresh of options
  const refresh = useCallback(() => {
    setRefreshCounter((prev) => prev + 1);
  }, []);

  // Memoizing the fetch function to avoid recreating it on every render
  const fetchOptions = useCallback(
    async (url: string) => {
      try {
        console.log("Fetching dynamic options from:", url);

        // Abort any in-flight requests
        if (fetchControllerRef.current) {
          fetchControllerRef.current.abort();
        }

        // Create a new controller for this request
        const controller = new AbortController();
        fetchControllerRef.current = controller;

        const response = await apiClient.get(url, {
          signal: controller.signal,
        });

        if (response.status < 200 || response.status >= 300) {
          throw new Error(
            `Failed to fetch dropdown options: ${response.status} ${response.statusText}`
          );
        }

        // Check if component is still mounted
        if (!isMountedRef.current) return [];

        const data = response.data;
        if (!Array.isArray(data)) throw new Error("Expected array response");

        // Update the URL ref
        urlRef.current = url;

        return extractDropdownOptions(
          data,
          dynamicConfig?.valueField || "id",
          dynamicConfig?.labelField || "name"
        );
      } catch (err: any) {
        if (axios.isAxiosError(err) && err.name === "AbortError") {
          console.log("Fetch aborted");
          return [];
        }
        console.log("Error fetching dropdown options:", err.message);
        throw new Error("Failed to fetch dropdown options");
      }
    },
    [dynamicConfig, apiClient]
  );

  // Effect to fetch options whenever dependencies or refresh counter changes
  useEffect(() => {
    // Skip if already processing a fetch to prevent loops
    if (processingFetchRef.current) {
      return;
    }

    // Set processing flag
    processingFetchRef.current = true;

    // Set mounted ref to true
    isMountedRef.current = true;

    // Skip if no config
    if (!dynamicConfig) {
      setOptions([]);
      processingFetchRef.current = false;
      return;
    }

    // Clear any existing timeout
    if (fetchTimeoutRef.current) {
      window.clearTimeout(fetchTimeoutRef.current);
      fetchTimeoutRef.current = null;
    }

    // Check if dependencies have actually changed
    let shouldRefetch = refreshCounter > 0;

    if (dynamicConfig?.dependsOn && dependencies) {
      // Function to check if dependencies have changed
      const checkDependencyChanges = () => {
        let hasChanged = false;
        let shouldClearOptions = false;
        
        // Case 1: String format (backward compatibility)
        if (typeof dynamicConfig.dependsOn === 'string') {
          const dependencyKey = dynamicConfig.dependsOn;
          const currentValue = dependencies[dependencyKey] || "";
          const previousValue = previousDependenciesRef.current[dependencyKey] || "";
          
          // Update the previous dependencies ref
          previousDependenciesRef.current = {
            ...previousDependenciesRef.current,
            [dependencyKey]: currentValue,
          };
          
          // If dependency changed, we should refetch and clear options
          if (currentValue !== previousValue) {
            hasChanged = true;
            shouldClearOptions = !currentValue; // Clear if value is empty
          }
        }
        // Case 2: Array of dependency configs
        else if (Array.isArray(dynamicConfig.dependsOn)) {
          for (const depConfig of dynamicConfig.dependsOn) {
            const field = depConfig.field;
            const currentValue = dependencies[field] || "";
            const previousValue = previousDependenciesRef.current[field] || "";
            
            // Update the previous dependencies ref
            previousDependenciesRef.current = {
              ...previousDependenciesRef.current,
              [field]: currentValue,
            };
            
            // If any dependency changed, we should refetch
            if (currentValue !== previousValue) {
              hasChanged = true;
              if (!currentValue) {
                shouldClearOptions = true;
                break;
              }
            }
          }
        }
        // Case 3: Object with field names as keys
        else if (typeof dynamicConfig.dependsOn === 'object') {
          for (const field of Object.keys(dynamicConfig.dependsOn)) {
            const currentValue = dependencies[field] || "";
            const previousValue = previousDependenciesRef.current[field] || "";
            
            // Update the previous dependencies ref
            previousDependenciesRef.current = {
              ...previousDependenciesRef.current,
              [field]: currentValue,
            };
            
            // If any dependency changed, we should refetch
            if (currentValue !== previousValue) {
              hasChanged = true;
              if (!currentValue) {
                shouldClearOptions = true;
                break;
              }
            }
          }
        }
        
        return { hasChanged, shouldClearOptions };
      };
      
      const { hasChanged, shouldClearOptions } = checkDependencyChanges();
      
      if (hasChanged) {
        shouldRefetch = true;
        // Clear options immediately when dependency changes
        setOptions([]);
        
        if (shouldClearOptions) {
          setLoading(false);
          processingFetchRef.current = false;
          return;
        }
      }
    }

    // Skip fetch if URL hasn't changed and no other reason to refetch
    const url = getFetchUrl(
      dynamicConfig.url,
      dynamicConfig,
      dependencies
    );

    if (url === urlRef.current && !shouldRefetch) {
      setLoading(false);
      processingFetchRef.current = false;
      return;
    }

    // Set loading state
    setLoading(true);
    setError(null);

    console.log(`Fetching options (${refreshCounter}): ${url}`);

    // Introduce a small delay to prevent rapid consecutive fetches
    fetchTimeoutRef.current = window.setTimeout(() => {
      fetchOptions(url)
        .then((fetchedOptions) => {
          if (isMountedRef.current) {
            console.log(
              `Fetched ${fetchedOptions.length} options for dropdown`
            );
            setOptions(fetchedOptions);
            setError(null);
          }
        })
        .catch((err) => {
          if (isMountedRef.current) {
            setError(err instanceof Error ? err.message : "Unknown error");
            console.log("Error fetching options:", err);
            // Initialize options as empty array when there's an error
            setOptions([]);
          }
        })
        .finally(() => {
          if (isMountedRef.current) {
            setLoading(false);
          }
          // Reset processing flag
          processingFetchRef.current = false;
        });
    }, 100); // Small delay to debounce rapid changes

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      if (fetchControllerRef.current) {
        fetchControllerRef.current.abort();
      }
      if (fetchTimeoutRef.current) {
        window.clearTimeout(fetchTimeoutRef.current);
      }
      // Ensure we reset the processing flag on cleanup
      processingFetchRef.current = false;
    };
  }, [dynamicConfig, dependencies, fetchOptions, refreshCounter, apiClient]);

  return {
    options: Array.isArray(options) ? options : [],
    loading,
    error,
    refresh,
  };
};
