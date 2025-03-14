import { getCookie } from 'cookies-next';

interface FetchOptions extends RequestInit {
  baseUrl?: string;
  params?: Record<string, string>;
}

/**
 * Centralized fetch function with authorization headers
 * @param url The URL to fetch
 * @param options Additional fetch options
 * @returns Promise with the fetch response
 */
export const fetchWithAuth = async (url: string, options: FetchOptions = {}): Promise<Response> => {
  const { 
    baseUrl = '', 
    params = {}, 
    headers = {}, 
    method = 'GET',
    ...restOptions 
  } = options;

  // Build the full URL with query parameters
  let fullUrl = `${baseUrl}${url}`;
  
  // Add query parameters if provided
  if (Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, value);
    });
    fullUrl += `${fullUrl.includes('?') ? '&' : '?'}${searchParams.toString()}`;
  }

  // Get the authentication token
  const token = getCookie("new-vision-token");

  // Create headers with authentication
  const fetchHeaders: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...headers as Record<string, string>,
  };

  // Add authorization header if token exists
  if (token) {
    fetchHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Return the fetch promise
  return fetch(fullUrl, {
    method,
    headers: fetchHeaders,
    credentials: 'omit', // Don't send credentials by default
    mode: 'cors', // Explicitly request CORS
    cache: 'no-store', // Disable caching
    ...restOptions,
  });
};

/**
 * Fetch JSON data with authentication
 * @param url The URL to fetch
 * @param options Additional fetch options
 * @returns Promise with the parsed JSON data
 */
export const fetchJsonWithAuth = async <T = any>(url: string, options: FetchOptions = {}): Promise<T> => {
  const response = await fetchWithAuth(url, options);
  
  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
  }
  
  return response.json() as Promise<T>;
};

/**
 * Post JSON data with authentication
 * @param url The URL to post to
 * @param data The data to post
 * @param options Additional fetch options
 * @returns Promise with the parsed JSON response
 */
export const postJsonWithAuth = async <T = any, D = any>(
  url: string, 
  data: D, 
  options: FetchOptions = {}
): Promise<T> => {
  const response = await fetchWithAuth(url, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  });
  
  return response.json() as Promise<T>;
};