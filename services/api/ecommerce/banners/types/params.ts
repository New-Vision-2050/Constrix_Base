export interface CreateBannerParams {
  "name[ar]"?: string;
  "name[en]"?: string;
  type: string;
  banner_image: File;
}

export interface UpdateBannerParams {
  "name[ar]"?: string;
  "name[en]"?: string;
  type?: string;
  banner_image?: File;
}
