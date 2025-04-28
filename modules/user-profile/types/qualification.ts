import { MediaFile } from "@/types/media-file";

export type Qualification = {
  id: string;
  academic_qualification_id: string;
  academic_specialization_id: string;
  company_id: string;
  country_id: string;
  files: MediaFile[];
  global_id: string;
  graduation_date: string;
  study_rate: number;
  university_id: string;
  academic_qualification_name: string;
  academic_specialization_name: string;
  country_name: string;
  university_name: string;
};
