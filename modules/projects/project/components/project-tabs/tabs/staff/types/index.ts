export interface ProjectEmployeeRoleSummary {
  id: string;
  name: string;
  slug: string;
  is_default: boolean;
}

export interface Employee {
  id: string;
  projectId: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  company: { id: string; name: string };
  assignedAt: string;
  assignedBy: { id: string; name: string } | null;
  createdAt: string;
  /** Embedded role from employees list API (`project_role`) */
  projectRole?: ProjectEmployeeRoleSummary | null;
}

