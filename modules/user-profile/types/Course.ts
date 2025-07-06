import { MediaFile } from "@/types/media-file";

export type Course = {
  authority: string;
  certificate: string;
  company_name: string;
  date_end: string;
  date_obtain: string;
  id: string;
  institute: string;
  name: string;
  file: MediaFile;
};
