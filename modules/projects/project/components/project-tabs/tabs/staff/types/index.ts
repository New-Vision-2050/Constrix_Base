export interface Employee {
    id: string;
    name: string;
    phone: string;
    email: string;
    branch: { id: number; name: string };
    jobTitle: string;
    department: string;
  }