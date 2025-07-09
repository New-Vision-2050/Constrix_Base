import { ConstraintConfig } from "@/modules/attendance-departure/types/attendance";

export type Constraint = {
  branches: { id: string; name: string }[];
  config: ConstraintConfig;
  constraint_name: string;
  constraint_type: string;
  created_at: string;
  created_by: string;
  end_date: string;
  id: string;
  is_active: number;
  notes: string;
  priority: number;
  start_date: string;
};
