import { useQuery } from "@tanstack/react-query";
import fetchDashboardOverview from "../api/fetch-dashboard-overview";

export default function useDashboardOverview() {
  return useQuery({
    queryKey: [`dashboard-overview`],
    queryFn: fetchDashboardOverview,
  });
}
