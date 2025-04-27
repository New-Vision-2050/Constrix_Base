export type Salary = {
  user_id: string;
  basic: string;
  salary: number;
  type: string;
  description: string;
  hour_rate: string;
  period: { id: string; name: string };
  period_id: string;
  salary_type: { id: string; name: string; code: string };
  salary_type_code: string;
};
