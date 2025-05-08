export type JobTitle = {
  id: string;
  name: string;
  type: string;
  description: string;
  status: number;
  user_count: string;
  job_type: {
    id: string;
    name: string;
  };
};
