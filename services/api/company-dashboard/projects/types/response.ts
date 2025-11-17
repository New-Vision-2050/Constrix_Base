import { CompanyDashboardProject } from "@/modules/content-management-system/projects/types";
import { ApiBaseResponse } from "@/types/common/response/base";
import { ApiPaginatedResponse } from "@/types/common/response/paginated";

/**
 * Response for listing projects
 * Returns paginated list of projects
 */
export interface ListProjectsResponse
  extends ApiPaginatedResponse<CompanyDashboardProject[]> {}

/**
 * Response for showing a single project
 * Returns a single project with its details
 */
export interface ShowProjectResponse
  extends ApiBaseResponse<CompanyDashboardProject> {}

/**
 * Response for creating a new project
 */
export interface CreateProjectResponse
  extends ApiBaseResponse<CompanyDashboardProject> {}

/**
 * Response for updating a project
 */
export interface UpdateProjectResponse
  extends ApiBaseResponse<CompanyDashboardProject> {}

