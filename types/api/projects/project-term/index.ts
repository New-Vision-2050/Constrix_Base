import { DB_Boolean } from "../../shared/db-boolean";

export interface PRJ_ProjectTerm {
  id: number;
  reference_number: string;
  name: string;
  description: string;
  sub_items_count: number;
  services: string[];
  status: string; // "1" for active, "0" for inactive
  parent_id: number | null;
  project_type_id: number | null;
  created_at: string;
  updated_at: string;
}
