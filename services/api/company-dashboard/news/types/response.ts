import { ApiBaseResponse } from "@/types/common/response/base";
import { ApiPaginatedResponse } from "@/types/common/response/paginated";

export interface NewsImage {
  id: number;
  url: string;
  name: string;
  mime_type: string;
  type: string;
}

export interface NewsListItem {
  id: string;
  title_ar?: string;
  title_en?: string;
  title?: string;
  content_ar?: string;
  content_en?: string;
  content?: string;
  category_id?: number | string;
  category_name?: string;
  category?: string;
  publish_date?: string;
  end_date?: string;
  is_active?: "active" | "inActive";
  thumbnail_image?: string;
  main_image?: string;
}

export interface News {
  id: string;
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  category_id?: number | string;
  category_website_cms_id?: number | string;
  publish_date: string;
  end_date?: string;
  thumbnail_image?: NewsImage;
  thumbnail?: string;
  main_image?: string;
}

export interface ListNewsResponse
  extends ApiPaginatedResponse<NewsListItem[]> {}

export interface ShowNewsResponse extends ApiBaseResponse<News> {}
