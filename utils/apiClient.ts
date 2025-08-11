import { apiClient } from "@/config/axios-config";
import axios from "axios";
import { useLocale } from "next-intl";
import { getCookie } from "cookies-next";
import { getCurrentHost } from "./get-current-host";
import { getClientHost } from "./get-client-host";

/**
 * Creates an API client instance with the current locale
 * This function should be used within React components
 */
export const useApiClient = () => {
  const locale = useLocale();

  // Create a new instance with the current locale
  const instance = axios.create({
    baseURL: apiClient.defaults.baseURL,
    headers: {
      ...apiClient.defaults.headers,
      "Accept-Language": locale,
      Lang: locale,
    },
  });

  // Add the same interceptors as the main apiClient
  instance.interceptors.request.use(
    async (config) => {
      const nvToken = getCookie("new-vision-token");
      console.log(nvToken);
      const currentHost = await getCurrentHost();
      if (currentHost) {
        config.headers["X-Domain"] = currentHost;
      }
      if (nvToken) {
        config.headers.Authorization = `Bearer ${nvToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return instance;
};

/**
 * Creates fetch options for API requests with proper headers
 * including authentication and locale
 * @param locale The current locale (e.g., 'en', 'ar')
 * @param controller Optional AbortController for the request
 */
export const createApiRequestOptions = (
  locale: string,
  controller?: AbortController
): RequestInit => {
  const token = getCookie("new-vision-token");
  console.log(token);
  // Get domain if in browser environment
  const domain = getClientHost() || "";

  return {
    signal: controller?.signal,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Accept-Language": locale,
      Lang: locale,
      "X-Domain": domain,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    method: "GET",
    credentials: "omit",
    mode: "cors",
    cache: "no-store",
  };
};

/**
 * Performs a GET request with proper headers
 * @param url The URL to fetch from
 * @param locale The current locale
 * @param controller Optional AbortController for the request
 */
export const apiGet = async <T>(
  url: string,
  locale: string,
  controller?: AbortController
): Promise<T> => {
  const response = await fetch(
    url,
    createApiRequestOptions(locale, controller)
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

/**
 * Performs a POST request with proper headers
 * @param url The URL to post to
 * @param data The data to send
 * @param locale The current locale
 * @param controller Optional AbortController for the request
 */
export const apiPost = async <T>(
  url: string,
  data: any,
  locale: string,
  controller?: AbortController
): Promise<T> => {
  const options = createApiRequestOptions(locale, controller);

  const response = await fetch(url, {
    ...options,
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

/**
 * Performs a PUT request with proper headers
 * @param url The URL to put to
 * @param data The data to send
 * @param locale The current locale
 * @param controller Optional AbortController for the request
 */
export const apiPut = async <T>(
  url: string,
  data: any,
  locale: string,
  controller?: AbortController
): Promise<T> => {
  const options = createApiRequestOptions(locale, controller);

  const response = await fetch(url, {
    ...options,
    method: "PUT",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

/**
 * Performs a DELETE request with proper headers
 * @param url The URL to delete from
 * @param locale The current locale
 * @param controller Optional AbortController for the request
 */
export const apiDelete = async <T>(
  url: string,
  locale: string,
  controller?: AbortController
): Promise<T> => {
  const options = createApiRequestOptions(locale, controller);

  const response = await fetch(url, {
    ...options,
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};
