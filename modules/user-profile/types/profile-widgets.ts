export type ProfileWidgetContract = {
  end_date: string;
  start_date: string;
  user_salary: string;
  trial_period_days?: number;
  notice_period_days?: number;
};

export type ProfileWidgetTasksData = {
  period: string;
  from_date: string;
  to_date: string;
  total_count: number;
  accepted_count: number;
  accepted_status: string;
  accepted_percentage: number;
};

export type ProfileWidgetData = {
  contract: ProfileWidgetContract;
  tasks?: ProfileWidgetTasksData;
};
