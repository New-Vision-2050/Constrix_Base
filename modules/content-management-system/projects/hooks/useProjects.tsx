import { CompanyDashboardProjectsApi } from "@/services/api/company-dashboard/projects";
import { useQuery } from "@tanstack/react-query";

export default function useProjects() {
  return useQuery({
    queryKey: [`cms-projects-list`],
    queryFn: () => CompanyDashboardProjectsApi.list(),
  });
}
