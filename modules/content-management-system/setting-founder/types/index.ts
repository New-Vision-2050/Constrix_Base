/**
 * Founder Module Types
 * Centralized type definitions for the founder module
 */

/**
 * Image file structure returned from API
 */
export interface FounderImage {
  id: number;
  url: string;
  name: string;
  mime_type: string;
  type: string;
}

/**
 * Founder row data structure for table display
 */
export interface FounderRow {
  id: string;
  name: string;
  name_ar?: string;
  name_en?: string;
  job_title: string;
  job_title_ar?: string;
  job_title_en?: string;
  description: string;
  description_ar?: string;
  description_en?: string;
  is_active: number;
  profile_image?: FounderImage;
}

/**
 * Founder data structure from API response
 */
export interface FounderData {
  id: string;
  name_ar?: string;
  name_en?: string;
  job_title_ar?: string;
  job_title_en?: string;
  description_ar?: string;
  description_en?: string;
  profile_image?: FounderImage;
}

/**
 * Parameters for table configuration hook
 */
export interface TableConfigParams {
  onEdit?: (id: string) => void;
}

/**
 * Props for AddFounderDialog component
 */
export interface AddFounderDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  founderId?: string;
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

