export interface CreatePageSettingParams {
  type?: string;
  url: string;
  "title[ar]"?: string;
  "title[en]"?: string;
  "description[ar]"?: string;
  "description[en]"?: string;
  image?: File;
  is_active?: boolean;
}

export interface UpdatePageSettingParams
  extends Partial<CreatePageSettingParams> {}
