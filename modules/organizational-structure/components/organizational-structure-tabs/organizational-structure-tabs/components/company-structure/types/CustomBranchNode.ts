export type Manager = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export type CustomBranchNodeT = {
  parent_id?: number;
  name?: string;
  type?: string;
  manager?: Manager;
  department_count?: number;
  management_count?: number;
  branch_count?: number;
  user_count?: number;
};
