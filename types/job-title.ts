export type JobTitle = {
  id: string;
  name: string;
  type: string;
  description: string;
  status: number;
  user_count: string;
  is_active: number;
  job_type: {
    id: string;
    name: string;
  };
};
