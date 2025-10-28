export interface CreateSocialMediaParams {
  social_icons_id: string;
  url: string;
  is_active?: boolean;
}

export interface UpdateSocialMediaParams {
  social_icons_id?: string;
  url?: string;
  is_active?: boolean;
}

export interface ListSocialMediaParams {
  page?: number;
  per_page?: number;
  search?: string;
}
