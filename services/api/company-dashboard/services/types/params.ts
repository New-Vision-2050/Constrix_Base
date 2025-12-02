export interface PreviousWorkParam {
  description: string;
  image?: File | null;
}

export interface CreateServiceParams {
  name_ar: string;
  name_en: string;
  reference_number?: string;
  category_website_cms_id: string;
  description_ar: string;
  description_en: string;
  status: boolean;
  icon?: File | null;
  main_image?: File | null;
  previous_work?: PreviousWorkParam[];
}

export interface UpdateServiceParams extends Partial<CreateServiceParams> {}
