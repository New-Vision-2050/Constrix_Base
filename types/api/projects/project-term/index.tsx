import { DB_Boolean } from "../../shared/db-boolean";

export interface PRJ_ProjectTerm {
  id: number;
  reference_number: string;
  name: string;
  description: string;
  sub_items_count: number;
  services: string[];
  status: DB_Boolean;
  parent_id: number | null;
  project_type_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface PRJ_ProjectTermWithServices extends Omit<
  PRJ_ProjectTerm,
  "services"
> {
  services: PRJ_ProjectTermService[];
}

export interface PRJ_ProjectTermService {
  id: number;
  project_term_id: number;
  service_name: string;
  service_type: string;
  cost: number;
  unit: string;
  quantity: number;
  status: DB_Boolean;
}
