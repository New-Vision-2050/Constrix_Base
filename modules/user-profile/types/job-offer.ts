import { MediaFile } from "@/types/media-file";

export type JobOffer = {
  company_id: string;
  created_at: string;
  date_accept: string;
  date_send: string;
  global_id: string;
  id: string;
  files: MediaFile;
  job_offer_number: string;
  updated_at: string;
};
