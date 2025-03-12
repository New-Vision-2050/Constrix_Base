import { useState, useEffect, useCallback, useRef } from 'react';
import { DropdownOption, DynamicDropdownConfig } from '@/modules/table/utils/tableTypes';
import { fetchWithAuth } from '@/utils/fetchUtils';
import { useDebounce } from './useDebounce';

interface UseDropdownSearchProps {
  searchTerm: string;
  dynamicConfig?: DynamicDropdownConfig;
  dependencies?: Record<string, string>;
}

interface UseDropdownSearchResult {
  options: DropdownOption[];
  loading: boolean;
  error: string | null;
}

export const useDropdownSearch = ({
  searchTerm,
  dynamicConfig,
  dependencies
}: UseDropdownSearchProps): UseDropdownSearchResult => {
  const [options, setOptions] = useState<DropdownOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);
  
  // Create a debounced search term
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);
  
  // Build the URL for the request
  const buildSearchUrl = useCallback(() => {
    if (!dynamicConfig) return null;
    
    let url = dynamicConfig.url;
    const params = new URLSearchParams();
    
    // Add search parameter if configured and search term exists
    // Note: We now allow empty search terms to fetch all results
    if (dynamicConfig.searchParam && debouncedSearchTerm !== undefined) {
      params.append(dynamicConfig.searchParam, debouncedSearchTerm);
    }
    
    // Add dependency filter parameter if configured
    if (
      dynamicConfig.dependsOn && 
      dynamicConfig.filterParam && 
      dependencies && 
      dependencies[dynamicConfig.dependsOn]
    ) {
      params.append(
        dynamicConfig.filterParam, 
        dependencies[dynamicConfig.dependsOn]
      );
    }
    
    // Add pagination parameters if enabled
    if (dynamicConfig.paginationEnabled) {
      const pageParam = dynamicConfig.pageParam || 'page';
      const limitParam = dynamicConfig.limitParam || 'per_page';
      const itemsPerPage = dynamicConfig.itemsPerPage || 10;
      
      params.append(pageParam, '1');
      params.append(limitParam, String(itemsPerPage));
    }
    
    // Append params to URL
    const queryString = params.toString();
    if (queryString) {
      url = `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
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
    
    // Set loading state to true and log it
    setLoading(true);
    console.log('useDropdownSearch - setLoading(true)');
    setError(null);
    
    try {
      // Use the centralized fetch utility
      const response = await fetchWithAuth(url, {
        signal: controller.signal
      });
      
      if (!isMountedRef.current) return;
      
      if (!response.ok) {
        throw new Error(`Failed to fetch options: ${response.status}`);
      }
      
      let data = await response.json();
      
      if (!isMountedRef.current) return;
         
      if (typeof data === 'object') {
        const arrayCandidate = Object.values(data).find(val => Array.isArray(val));
        if (arrayCandidate && Array.isArray(arrayCandidate)) {
          data = arrayCandidate;
        } else {
          data = [data];
        }
      }
      if (!Array.isArray(data)) {
        throw new Error('Expected array response from API');
      }
      
      // If data is empty array, set empty options
      if (Array.isArray(data) && data.length === 0) {
        // Set empty options when search returns no results
        setOptions([]);
      } else {
        // Extract values and labels from the response
        const extractedOptions = data.map(item => {
          const getValue = (obj: any, path: string) => {
            return path.split('.').reduce((acc, part) => acc && acc[part], obj);
          };
          
          return {
            value: String(getValue(item, dynamicConfig.valueField)),
            label: String(getValue(item, dynamicConfig.labelField))
          };
        });
        
        // Filter out invalid options and remove duplicates
        const validOptions = extractedOptions
          .filter(opt => opt.value && opt.value.trim() !== '')
          .reduce((acc: DropdownOption[], current) => {
            const x = acc.find(item => item.value === current.value);
            if (!x) return acc.concat([current]);
            return acc;
          }, []);
        
        setOptions(validOptions);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Silently handle aborted requests
        return;
      }
      
      if (isMountedRef.current) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        console.log('useDropdownSearch - setLoading(false)');
      }
    }
  }, [dynamicConfig, dependencies, buildSearchUrl, debouncedSearchTerm]);
  
  // Fetch options when dependencies or search term change
  useEffect(() => {
    isMountedRef.current = true;
    
    // Fetch in two cases:
    // 1. When the search term is completely empty (to fetch all results)
    // 2. When the search term has at least 3 characters
    if (debouncedSearchTerm === '' || (debouncedSearchTerm && debouncedSearchTerm.trim().length > 2)) {
      fetchOptions();
    } else if (debouncedSearchTerm && debouncedSearchTerm.trim().length > 0 && debouncedSearchTerm.trim().length <= 2) {
      // For short searches (1-2 characters), clear the options
      setOptions([]);
    }
    
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
    error
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
