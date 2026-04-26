export type ProfileWidgetContract = {
  end_date: string;
  start_date: string;
  user_salary: string;
  trial_period_days?: number;
  notice_period_days?: number;
};

export type ProfileWidgetData = {
  contract: ProfileWidgetContract;
};
