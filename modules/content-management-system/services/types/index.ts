export interface PreviousWork {
  id: string;
  description: string;
  image: File | string | null;
}

export interface ServiceFormData {
  name_ar: string;
  name_en: string;
  request_id: string;
  category_id: string;
  description_ar: string;
  description_en: string;
  is_featured: boolean;
  icon_image: File | string | null;
  main_image: File | string | null;
  previous_works: PreviousWork[];
}

export interface ServiceRow {
  id: string;
  name_ar?: string;
  name_en?: string;
  name?: string;
  category?: Category;
  category_name?: string;
  is_featured?: boolean;
  is_active?: "active" | "inActive";
}

export interface ServiceData {
  id: string;
  name_ar: string;
  name_en: string;
  request_id: string;
  category_id: string;
  description_ar: string;
  description_en: string;
  is_featured: boolean;
  icon_image?: {
    url?: string;
  };
  main_image?: {
    url?: string;
  };
  previous_works?: Array<{
    id: string;
    description: string;
    image?: {
      url?: string;
    };
  }>;
}

export interface AddServiceDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  serviceId?: string;
}

export interface TableConfigParams {
  onEdit?: (id: string) => void;
}

export interface ApiResponse<T> {
  data: {
    payload: T;
  };
}

export interface AxiosError {
  response?: {
    status?: number;
    data?: {
      errors?: Record<string, string[]>;
    };
  };
}

export interface Category {
  id: string | number;
  name_ar?: string;
  name_en?: string;
  name?: string;
}
