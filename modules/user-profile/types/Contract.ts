import { MediaFile } from "@/types/media-file";

export type Contract = {
  annual_leave: number;
  commencement_date: string;
  company_id: string;
  contract_duration: string;
  contract_number: string;
  state_id: string;
  state_name: string;
  country_name: string;
  file_url: string;
  global_id: string;
  id: string;
  files: MediaFile[];
  nature_work: { id: string; name: string };
  notice_period: number;
  probation_period: number;
  start_date: string;
  type_working_hours: { id: string; name: string };
  working_hours: number;
  contract_duration_unit: { id: string; name: string };

  notice_period_unit: { id: string; name: string };
  probation_period_unit: { id: string; name: string };
  right_terminate: { id: string; name: string };
  type_working_hour: { id: string; name: string };
};
