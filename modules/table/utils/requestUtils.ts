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
  searchConfig?: SearchConfig
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

  // Add pagination parameters
  newUrl.searchParams.append("page", currentPage.toString());
  newUrl.searchParams.append("per_page", itemsPerPage.toString());

  // Add sorting parameters
  if (sortColumn && sortDirection) {
    newUrl.searchParams.append("_sort", sortColumn);
    newUrl.searchParams.append("_order", sortDirection);
  }

  // Add global search parameters
  if (searchQuery) {
    // Use the configured search parameter name or default to 'q'
    const searchParamName = searchConfig?.paramName || "q";
    newUrl.searchParams.append(searchParamName, searchQuery);

    // Add search fields if specified and a fieldParamName is provided
    if (searchFields?.length && searchConfig?.fieldParamName) {
      newUrl.searchParams.append(
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
        // For JSON placeholder API, use the column name directly
        newUrl.searchParams.append(columnKey, searchValue);
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
