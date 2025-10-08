import { UserActivityT } from "@/modules/user-profile/types/user-activity";

export type Media = {
  id: number;
  url: string;
  name: string;
  mime_type: string;
  type: string;
  size: number;
};

export type DocumentT = {
  access_type: string;
  created_at: string;
  id: string;
  name: string;
  parent_id: string;
  updated_at: string;
  file: Media;
  last_log: UserActivityT;
  files_count: number;
  status: number;
  end_date: string;
  reference_number: string;
  start_date: string;
  users: any[];
};
