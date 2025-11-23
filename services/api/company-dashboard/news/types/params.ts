export interface CreateNewsParams {
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  category_website_cms_id: string;
  publish_date: string;
  end_date?: string;
  thumbnail?: File | null;
  main_image?: File | null;
}

export interface UpdateNewsParams extends Partial<CreateNewsParams> {}

