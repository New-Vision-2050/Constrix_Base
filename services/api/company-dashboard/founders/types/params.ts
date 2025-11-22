export interface CreateFounderParams {
  name_ar: string;
  name_en: string;
  job_title_ar: string;
  job_title_en: string;
  description_ar: string;
  description_en: string;
  personal_photo?: File | null;
}

export interface UpdateFounderParams extends Partial<CreateFounderParams> {}

