/**
 * News Module Types
 * Centralized type definitions for the news module
 */

/**
 * Image file structure returned from API
 */
export interface NewsImage {
  id: number;
  url: string;
  name: string;
  mime_type: string;
  type: string;
}

/**
 * News row data structure for table display
 */
export interface NewsRow {
  id: string;
  title: string;
  title_ar?: string;
  title_en?: string;
  content: string;
  content_ar?: string;
  content_en?: string;
  category: Category;
  status: number;
  category_id?: number | string;
  category_name?: string;
  publish_date: string;
  end_date: string;
  is_active: number;
  thumbnail_image?: NewsImage;
  main_image?: NewsImage;
}

/**
 * News data structure from API response
 */
export interface NewsData {
  id: string;
  title_ar?: string;
  title_en?: string;
  content_ar?: string;
  content_en?: string;
  category_id?: number | string;
  publish_date?: string;
  end_date?: string;
  thumbnail_image?: NewsImage;
  main_image?: NewsImage;
}

/**
 * Category data structure for dropdown
 */
export interface Category {
  id: number | string;
  name_ar?: string;
  name_en?: string;
  name?: string;
}

/**
 * Parameters for table configuration hook
 */
export interface TableConfigParams {
  onEdit?: (id: string) => void;
}

/**
 * Props for AddNewsDialog component
 */
export interface AddNewsDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  newsId?: string;
}

/**
 * Axios error structure for error handling
 */
export interface AxiosError {
  response?: {
    status?: number;
    data?: {
      errors?: Record<string, string[]>;
      message?: string;
    };
  };
  message?: string;
}

/**
 * API response structure
 */
export interface ApiResponse<T> {
  data?: {
    payload?: T;
    message?: string;
  };
  status?: number;
}
