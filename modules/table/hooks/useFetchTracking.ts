import { useRef } from 'react';

export const useFetchTracking = () => {
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const prevUrlRef = useRef<string>('');
  const paramsSignatureRef = useRef<string>('');
  
  const shouldFetchData = (url: string, paramsSignature: string) => {
    // Always fetch if URL changes
    if (url !== prevUrlRef.current) {
      console.log(`URL changed from ${prevUrlRef.current} to ${url}`);
      prevUrlRef.current = url;
      paramsSignatureRef.current = paramsSignature;
      return true;
    }
    
    // Skip if this exact request was just made
    if (paramsSignature === paramsSignatureRef.current) {
      console.log('Skipping duplicate API request with identical parameters');
      return false;
    }
    
    // Parameters changed, update signature and fetch
    console.log('Parameters changed, fetching new data');
    paramsSignatureRef.current = paramsSignature;
    return true;
  };
  
  const setupAbortController = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    const controller = new AbortController();
    abortControllerRef.current = controller;
    return controller;
  };
  
  const cleanup = () => {
    isMountedRef.current = false;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };
  
  // Setup mounted ref
  isMountedRef.current = true;
  
  return {
    isMountedRef,
    abortControllerRef,
    prevUrlRef,
    shouldFetchData,
    setupAbortController,
    cleanup
  };
};

// Helper function to build a URL with search and pagination params
export const buildPaginatedUrl = (
  baseUrl: string,
  search?: string,
  searchParam: string = 'q',
  page: number = 1,
  limit: number = 10,
  pageParam: string = 'page',
  limitParam: string = 'per_page',
  additionalParams: Record<string, string> = {}
): URL => {
  // Fix URL handling: ensure URL is properly formatted
  let apiUrl: URL;
  try {
    // Check if URL already contains protocol
    if (baseUrl.startsWith('http://') || baseUrl.startsWith('https://')) {
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
  newUrl.searchParams.append(pageParam, page.toString());
  newUrl.searchParams.append(limitParam, limit.toString());
  
  // Add search parameter if provided
  if (search && search.trim() !== '') {
    newUrl.searchParams.append(searchParam, search);
  }
  
  // Add additional parameters
  Object.entries(additionalParams).forEach(([key, value]) => {
    if (value && value !== '') {
      newUrl.searchParams.append(key, value);
    }
  });
  
  return newUrl;
};
