export interface CreateIconParams {
  name_ar: string;
  name_en: string;
  category_website_cms_id: string;
  icon: File;
}

export interface UpdateIconParams {
  name_ar?: string;
  name_en?: string;
  category_website_cms_id?: string;
  icon?: File;
}

