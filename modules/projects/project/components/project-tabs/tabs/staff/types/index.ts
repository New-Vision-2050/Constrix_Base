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
}
