export interface CreateSocialMediaParams {
  platform: string;
  link: string;
  is_active?: boolean;
}

export interface UpdateSocialMediaParams {
  platform?: string;
  link?: string;
  is_active?: boolean;
}

export interface ListSocialMediaParams {
  page?: number;
  per_page?: number;
  search?: string;
}
