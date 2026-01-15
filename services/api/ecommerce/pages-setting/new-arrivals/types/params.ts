export interface CreatePageSettingParams {
  title: string;
  url: string;
  image?: File;
  is_active?: boolean;
  type: string;
}

export interface UpdatePageSettingParams {
  title?: string;
  url?: string;
  image?: File;
  is_active?: boolean;
  type?: string;
}
