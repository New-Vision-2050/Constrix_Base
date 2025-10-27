export interface CreateBrandParams {
  "name[ar]"?: string;
  "name[en]"?: string;
  "description[ar]"?: string;
  "description[en]"?: string;
  brand_image: File;
}

export interface UpdateBrandParams extends Partial<CreateBrandParams> {}
