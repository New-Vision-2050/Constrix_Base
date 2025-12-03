import { baseApi } from "@/config/axios/instances/base";
import {
  ListProjectsResponse,
  ShowProjectResponse,
  CreateProjectResponse,
  UpdateProjectResponse,
} from "./types/response";
import { CreateProjectParams, UpdateProjectParams } from "./types/params";
import { serialize } from "object-to-formdata";

/**
 * Website Projects API
 * Handles all CRUD operations for website projects
 */
export const CompanyDashboardProjectsApi = {
  /**
   * List all projects with optional search
   * @param params - Optional search parameters
   * @returns Promise with paginated list of projects
   */
  list: (params?: { search?: string, page?: number, limit?: number }) =>
    baseApi.get<ListProjectsResponse>("website-projects", {
      params: {
        ...params,
        page: params?.page || 1,
        limit: params?.limit || 10,
      },
    }),

  /**
   * Get a single project by ID
   * @param id - Project ID
   * @returns Promise with project details
   */
  show: (id: string) =>
    baseApi.get<ShowProjectResponse>(`website-projects/${id}`),

  /**
   * Create a new project
   * @param params - Project creation parameters
   * @returns Promise with created project
   */
  create: (body: CreateProjectParams) => {
    return baseApi.post<CreateProjectResponse>("website-projects", serialize(body, {
      indices: true,
    }));
  },

  /**
   * Update an existing project
   * @param id - Project ID
   * @param params - Project update parameters
   * @returns Promise with updated project
   */
  update: (id: string, body: UpdateProjectParams) => {
    return baseApi.post<UpdateProjectResponse>(
      `website-projects/${id}`,
      serialize(body, {
        indices: true,
      }), {
      params: {
        _method: "PUT",
      }
    });
  },

  /**
   * Delete a project
   * @param id - Project ID
   * @returns Promise
   */
  delete: (id: string) => baseApi.delete(`website-projects/${id}`),
};
