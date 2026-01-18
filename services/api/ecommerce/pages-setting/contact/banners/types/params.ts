export interface CreateBannerParams {
  title: string;
  url: string;
  image?: File;
  is_active?: boolean;
  type: string;
}

export interface UpdateBannerParams {
  title?: string;
  url?: string;
  image?: File;
  is_active?: boolean;
  type?: string;
}
