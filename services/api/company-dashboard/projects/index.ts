import { baseApi } from "@/config/axios/instances/base";
import {
  ListProjectsResponse,
  ShowProjectResponse,
  CreateProjectResponse,
  UpdateProjectResponse,
} from "./types/response";
import { CreateProjectParams, UpdateProjectParams } from "./types/params";

/**
 * Company Dashboard Projects API
 * Handles all CRUD operations for projects
 * 
 * Note: URLs are placeholders and should be updated when backend is ready
 */
export const CompanyDashboardProjectsApi = {
  /**
   * List all projects with optional search
   * @param params - Optional search parameters
   * @returns Promise with paginated list of projects
   */
  list: (params?: { search?: string }) =>
    baseApi.get<ListProjectsResponse>("company-dashboard/projects/list", {
      params,
    }),

  /**
   * Get a single project by ID
   * @param id - Project ID
   * @returns Promise with project details
   */
  show: (id: string) =>
    baseApi.get<ShowProjectResponse>(
      `company-dashboard/projects/${id}`
    ),

  /**
   * Create a new project
   * @param params - Project creation parameters
   * @returns Promise with created project
   */
  create: (params: CreateProjectParams) => {
    const formData = new FormData();

    // Featured services
    if (params.is_featured !== undefined) {
      formData.append("is_featured", params.is_featured ? "1" : "0");
    }
    if (params.main_image) {
      formData.append("main_image", params.main_image);
    }
    if (params.sub_images && params.sub_images.length > 0) {
      params.sub_images.forEach((file, index) => {
        formData.append(`sub_images[${index}]`, file);
      });
    }

    // Core project details
    formData.append("title[ar]", params["title[ar]"]);
    if (params["title[en]"]) {
      formData.append("title[en]", params["title[en]"]);
    }
    formData.append("type", params.type);
    formData.append("name[ar]", params["name[ar]"]);
    if (params["name[en]"]) {
      formData.append("name[en]", params["name[en]"]);
    }
    formData.append("description[ar]", params["description[ar]"]);
    if (params["description[en]"]) {
      formData.append("description[en]", params["description[en]"]);
    }

    // Project details array
    if (params.details && params.details.length > 0) {
      params.details.forEach((detail, index) => {
        formData.append(`details[${index}][detail_ar]`, detail.detail_ar);
        if (detail.detail_en) {
          formData.append(`details[${index}][detail_en]`, detail.detail_en);
        }
        formData.append(`details[${index}][service_id]`, detail.service_id);
      });
    }

    return baseApi.post<CreateProjectResponse>(
      "company-dashboard/projects",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  },

  /**
   * Update an existing project
   * @param id - Project ID
   * @param params - Project update parameters
   * @returns Promise with updated project
   */
  update: (id: string, params: UpdateProjectParams) => {
    const formData = new FormData();

    // Featured services
    if (params.is_featured !== undefined) {
      formData.append("is_featured", params.is_featured ? "1" : "0");
    }
    if (params.main_image) {
      formData.append("main_image", params.main_image);
    }
    if (params.sub_images && params.sub_images.length > 0) {
      params.sub_images.forEach((file, index) => {
        formData.append(`sub_images[${index}]`, file);
      });
    }

    // Core project details
    if (params["title[ar]"]) {
      formData.append("title[ar]", params["title[ar]"]);
    }
    if (params["title[en]"]) {
      formData.append("title[en]", params["title[en]"]);
    }
    if (params.type) {
      formData.append("type", params.type);
    }
    if (params["name[ar]"]) {
      formData.append("name[ar]", params["name[ar]"]);
    }
    if (params["name[en]"]) {
      formData.append("name[en]", params["name[en]"]);
    }
    if (params["description[ar]"]) {
      formData.append("description[ar]", params["description[ar]"]);
    }
    if (params["description[en]"]) {
      formData.append("description[en]", params["description[en]"]);
    }

    // Project details array
    if (params.details && params.details.length > 0) {
      params.details.forEach((detail, index) => {
        formData.append(`details[${index}][detail_ar]`, detail.detail_ar);
        if (detail.detail_en) {
          formData.append(`details[${index}][detail_en]`, detail.detail_en);
        }
        formData.append(`details[${index}][service_id]`, detail.service_id);
      });
    }

    return baseApi.post<UpdateProjectResponse>(
      `company-dashboard/projects/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  },

  /**
   * Delete a project
   * @param id - Project ID
   * @returns Promise
   */
  delete: (id: string) =>
    baseApi.delete(`company-dashboard/projects/${id}`),
};

