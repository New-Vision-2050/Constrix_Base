import { CompanyDashboardProjectsApi } from "@/services/api/company-dashboard/projects";
import { useQuery } from "@tanstack/react-query";

export default function useProjects(page?: number, limit?: number, search?: string, projectType?: string, sortBy?: string) {
  return useQuery({
    queryKey: [`cms-projects-list`, page, limit, search, projectType, sortBy],
    queryFn: () => CompanyDashboardProjectsApi.list({ page: page || 1, limit: limit || 10, search, projectType, sortBy }),
  });
}
