import { useRef, useEffect } from 'react';

// Create a global map to store active requests by URL
const activeRequestsMap = new Map<string, {
  controller: AbortController;
  timestamp: number;
  paramsSignature: string;
}>();

// Expose the map to the window object for debugging and cross-component access
if (typeof window !== 'undefined') {
  (window as any).activeRequestsMap = activeRequestsMap;
}

// Cleanup old requests periodically (requests older than 5 minutes)
const cleanupOldRequests = () => {
  const now = Date.now();
  const expirationTime = 5 * 60 * 1000; // 5 minutes
  
  activeRequestsMap.forEach((value, key) => {
    if (now - value.timestamp > expirationTime) {
      if (!value.controller.signal.aborted) {
        value.controller.abort();
      }
      activeRequestsMap.delete(key);
    }
  });
};

// Run cleanup every minute
setInterval(cleanupOldRequests, 60 * 1000);

export const useFetchTracking = () => {
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const prevUrlRef = useRef<string>('');
  const paramsSignatureRef = useRef<string>('');
  const requestIdRef = useRef<string>('');
  
  // Set up cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      
      // Don't abort the controller on route change
      // This allows the request to continue and be reused when returning to the page
      // We'll only abort if a new request with the same URL but different params is made
    };
  }, []);
  
  const shouldFetchData = (url: string, paramsSignature: string) => {
    // Try to parse the params signature to extract _forceRefetch
    let params: any;
    let forceRefetch = false;
    
    try {
      params = JSON.parse(paramsSignature);
      
      // Check if this is a forced refetch
      if (params._forceRefetch) {
        // Extract _forceRefetch and create a signature without it
        forceRefetch = true;
        const { _forceRefetch, ...restParams } = params;
        // Create a clean signature without the _forceRefetch property
        params = restParams;
      }
    } catch (e) {
      // If parsing fails, use the original signature
      console.error('Failed to parse params signature:', e);
    }
    
    // Generate a unique request ID (without _forceRefetch)
    const cleanParamsSignature = params ? JSON.stringify(params) : paramsSignature;
    const requestId = `${url}|${cleanParamsSignature}`;
    requestIdRef.current = requestId;
    
    // Always fetch if URL changes
    if (url !== prevUrlRef.current) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[FetchTracking] URL changed from ${prevUrlRef.current} to ${url}`);
      }
      prevUrlRef.current = url;
      paramsSignatureRef.current = cleanParamsSignature;
      return true;
    }
    
    // If this is a forced refetch, always fetch
    if (forceRefetch) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[FetchTracking] Forced refetch requested');
      }
      
      // Update the signature to include this force refetch
      // This prevents multiple force refetches with the same parameters
      paramsSignatureRef.current = cleanParamsSignature + `|force:${Date.now()}`;
      
      return true;
    }
    
    // Skip if this exact request was just made (ignoring _forceRefetch)
    if (cleanParamsSignature === paramsSignatureRef.current) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[FetchTracking] Skipping duplicate request');
      }
      return false;
    }
    
    // Parameters changed, update signature and fetch
    if (process.env.NODE_ENV === 'development') {
      console.log('[FetchTracking] Parameters changed, fetching new data');
    }
    paramsSignatureRef.current = cleanParamsSignature;
    return true;
  };
  
  const setupAbortController = () => {
    const requestId = requestIdRef.current;
    const url = prevUrlRef.current;
    
    // Check if we have an active request for this URL with different params
    // We use paramsSignatureRef.current which already has _forceRefetch removed
    const existingRequest = activeRequestsMap.get(url);
    if (existingRequest && existingRequest.paramsSignature !== paramsSignatureRef.current) {
      // Abort the existing request since parameters changed
      if (!existingRequest.controller.signal.aborted) {
        existingRequest.controller.abort();
      }
      activeRequestsMap.delete(url);
    }
    
    // Create a new controller
    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    // Store in the global map with the clean signature (without _forceRefetch)
    activeRequestsMap.set(url, {
      controller,
      timestamp: Date.now(),
      paramsSignature: paramsSignatureRef.current // This already has _forceRefetch removed
    });
    
    return controller;
  };
  
  const cleanup = () => {
    isMountedRef.current = false;
    
    // We intentionally don't abort the controller here
    // This allows the request to complete even if the component unmounts
    // The request will be reused if the user navigates back to the page
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
