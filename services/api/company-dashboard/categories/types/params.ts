export interface CreateCategoryParams {
  name_ar: string;
  name_en: string;
  category_type: string;
}

export interface UpdateCategoryParams {
  name_ar?: string;
  name_en?: string;
  category_type?: string;
}

