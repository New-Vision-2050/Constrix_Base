import { apiClient } from "@/config/axios-config";

export type DashboardOverviewT = {
  timezone: string;
  week: {
    starts_on: string;
    from_date: string;
    to_date: string;
  };
  tasks: {
    period: string;
    count: number;
    previous_count: number;
    percentage_change: number;
    trend: "up" | "down" | "neutral";
  };
  attendance: {
    period: string;
    worked_minutes: number;
    worked: {
      hours: number;
      minutes: number;
      label: string;
    };
    required_minutes: number;
    remaining_minutes: number;
    previous_worked_minutes: number;
    percentage_change: number;
    trend: "up" | "down" | "neutral";
    donut: { key: string; value: number }[];
  };
};

type ResponseT = {
  code: string;
  message: string;
  payload: DashboardOverviewT;
};

export default async function fetchDashboardOverview() {
  const res = await apiClient.get<ResponseT>(`/dashboard/overview`);
  return res.data.payload;
}
