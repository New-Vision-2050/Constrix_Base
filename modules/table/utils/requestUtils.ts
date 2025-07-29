import { getCookie } from "cookies-next";
import { SortDirection, SearchConfig, ColumnSearchState } from "./tableTypes";
import { createApiRequestOptions } from "@/utils/apiClient";
import { useLocale } from "next-intl";

/**
 * Constructs a URL with query parameters for table data fetching
 */
export const buildRequestUrl = (
  baseUrl: string,
  currentPage: number,
  itemsPerPage: number,
  sortColumn: string | null,
  sortDirection: SortDirection,
  searchQuery: string,
  searchFields?: string[],
  columnSearchState?: ColumnSearchState,
  searchConfig?: SearchConfig,
  apiParams?: Record<string, string>
): URL => {
  // Fix URL handling: ensure URL is properly formatted
  let apiUrl: URL;
  try {
    // Check if URL already contains protocol
    if (baseUrl.startsWith("http://") || baseUrl.startsWith("https://")) {
      apiUrl = new URL(baseUrl);
    } else {
      // Try to create URL with https:// prefix
      apiUrl = new URL(`https://${baseUrl}`);
    }
  } catch (e) {
    // Fallback to relative URL if all else fails
    apiUrl = new URL(baseUrl, window.location.origin);
  }

  // Cache any existing parameters from the original URL
  const existingParams = new URLSearchParams(apiUrl.search);
  const newUrl = new URL(apiUrl.origin + apiUrl.pathname);

  // Keep existing parameters
  existingParams.forEach((value, key) => {
    newUrl.searchParams.append(key, value);
  });

  if (apiParams) {
    const additionalParams = new URLSearchParams(apiParams);
    additionalParams.forEach((value, key) => {
      newUrl.searchParams.append(key, value);
    });
  }

  // Add pagination parameters
  newUrl.searchParams.set("page", currentPage.toString());
  newUrl.searchParams.set("per_page", itemsPerPage.toString());

  // Add sorting parameters
  if (sortColumn && sortDirection) {
    newUrl.searchParams.set("sort", sortColumn);
    newUrl.searchParams.set("order", sortDirection);
  }

  // Add global search parameters
  if (searchQuery) {
    // Use the configured search parameter name or default to 'q'
    const searchParamName = searchConfig?.paramName || "q";
    // Use set instead of append to prevent double encoding issues with non-Latin text
    newUrl.searchParams.set(searchParamName, searchQuery);

    // Add search fields if specified and a fieldParamName is provided
    if (searchFields?.length && searchConfig?.fieldParamName) {
      newUrl.searchParams.set(
        searchConfig.fieldParamName,
        searchFields.join(",")
      );
    }
  }

  // Add column-specific search parameters
  if (columnSearchState && Object.keys(columnSearchState).length > 0) {
    Object.entries(columnSearchState).forEach(([columnKey, searchValue]) => {
      // Skip empty values and special "_clear_" value
      if (
        searchValue &&
        searchValue !== "_clear_" &&
        searchValue !== "__clear__"
      ) {
        // Handle both string and string[] values
        if (Array.isArray(searchValue)) {
          // For array values, join them with commas or add multiple parameters
          if (searchValue.length > 0) {
            // Use setParam instead of append to prevent double encoding
            newUrl.searchParams.set(columnKey, searchValue.join(','));
          }
        } else {
          // For string values, add as normal but prevent double encoding
          // Use direct parameter setting to ensure consistent encoding
          newUrl.searchParams.set(columnKey, searchValue);
        }
      }
    });
  }

  console.log("Built URL with parameters:", newUrl.toString());
  return newUrl;
};

/**
 * Hook to create fetch options for the API request with proper locale
 */
export const useCreateFetchOptions = () => {
  const locale = useLocale();

  return (controller: AbortController): RequestInit => {
    return createApiRequestOptions(locale, controller);
  };
};

/**
 * Creates fetch options for the API request
 * @deprecated Use useCreateFetchOptions hook instead for proper locale support
 */
export const createFetchOptions = (
  controller: AbortController
): RequestInit => {
  const token = getCookie("new-vision-token");
  return {
    signal: controller.signal,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    method: "GET",
    credentials: "omit", // Don't send credentials by default
    mode: "cors", // Explicitly request CORS
    cache: "no-store", // Disable caching to prevent duplicate requests from using cached data
  };
};

/**
 * Sets up an abort timeout for a fetch request
 */
export const setupRequestTimeout = (
  controller: AbortController,
  onTimeout: () => void,
  timeoutMs: number = 15000
): number => {
  return window.setTimeout(() => {
    if (controller && !controller.signal.aborted) {
      controller.abort();
      onTimeout();
    }
  }, timeoutMs);
};
