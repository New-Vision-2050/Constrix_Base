export interface CreateIconParams {
  name_ar: string;
  name_en: string;
  website_icon_category_type: string;
  icon: File;
}

export interface UpdateIconParams {
  name_ar?: string;
  name_en?: string;
  website_icon_category_type?: string;
  icon?: File;
}

