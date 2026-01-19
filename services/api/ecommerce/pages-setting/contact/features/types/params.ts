export interface CreateFeatureParams {
  title: string;
  url: string;
  image?: File;
  is_active?: boolean;
  type: string;
}

export interface UpdateFeatureParams {
  title?: string;
  url?: string;
  image?: File;
  is_active?: boolean;
  type?: string;
}
