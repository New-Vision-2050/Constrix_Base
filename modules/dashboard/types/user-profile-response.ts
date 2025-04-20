import { Country } from "@/modules/settings/types/Country";
import { UserCompany } from "./user-company";

export type UserProfileData = {
  id: string;
  global_id: string;
  name: string;
  email: string;
  residence: string;
  passport: string;
  identity: string;
  border_number: string;
  phone: string;
  job_title_id: string;
  job_title: string;
  country: Country;
  data_status: number;
  company: UserCompany[];
  Job_role: string;
  date_appointment: string;
  branch: string;
  other_phone: string;
  address: string;
  address_attendance: string;
  image_url: string;
};
