import { ConstraintConfig } from "@/modules/attendance-departure/types/attendance";

export type Constraint = {
  branches: { id: string; name: string }[];
  branch_locations: { id: string; name: string }[];
  config: ConstraintConfig;
  constraint_name: string;
  constraint_type: string;
  constraint_code: string;
  created_at: string;
  created_by: string;
  end_date: string;
  id: string;
  name?:string;
  is_active: number;
  notes: string;
  priority: number;
  start_date: string;
};
