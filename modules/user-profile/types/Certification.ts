import { MediaFile } from "@/types/media-file";

export type Certification = {
  accreditation_degree: string;
  accreditation_name: string;
  accreditation_number: string;
  date_end: string;
  date_obtain: string;
  id: string;
  professional_bodie_id: string;
  professional_bodie_name: string;
  file: MediaFile;
};
