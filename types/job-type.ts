import { JobTitle } from "./job-title";

export type JobType = {
  id: string;
  job_titles: JobTitle[];
  name: string;
  status: number;
  user_count: number;
};
