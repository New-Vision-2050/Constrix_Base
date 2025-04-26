import { AxiosRequestConfig } from 'axios';

/**
 * Interface for custom request options
 */
export interface RequestOptions {
  /**
   * Custom URL to override the one in FormConfig
   */
  url?: string;
  
  /**
   * Custom HTTP method to override the one in FormConfig
   */
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'GET';
  
  /**
   * Additional Axios request configuration
   */
  config?: Omit<AxiosRequestConfig, 'url' | 'method' | 'data'>;
}