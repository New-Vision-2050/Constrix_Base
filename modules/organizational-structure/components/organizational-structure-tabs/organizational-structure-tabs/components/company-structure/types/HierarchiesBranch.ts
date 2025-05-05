import { Manager } from "./CustomBranchNode";

export type HierarchiesBranch = {
  branch_count: number;
  children: HierarchiesBranch[];
  department_count: number;
  id: number;
  management_count: number;
  manager: Manager;
  manager_id: number;
  name: string;
  parent_id: number;
  type: string;
  user_count: number;
};
