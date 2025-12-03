import { CompanyDashboardProjectsApi } from "@/services/api/company-dashboard/projects";
import { useQuery } from "@tanstack/react-query";

export default function useProjects(page?: number, limit?: number) {
  return useQuery({
    queryKey: [`cms-projects-list`, page, limit],
    queryFn: () => CompanyDashboardProjectsApi.list({ page: page || 1, limit: limit || 10 }),
  });
}
