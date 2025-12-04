import { baseApi } from "@/config/axios/instances/base";
import { ListThemesResponse, ShowThemeResponse } from "./types/response";

/**
 * Themes API service
 * Handles fetching theme data
 */
export const ThemesApi = {
  /**
   * List all themes with pagination and filters
   */
  list: (params?: { 
    search?: string; 
    page?: number; 
    limit?: number; 
    category?: string;
    sort?: string;
  }) =>
    baseApi.get<ListThemesResponse>("website-theme-settings", { params }),

  /**
   * Get single theme details
   */
  show: (id: string) =>
    baseApi.get<ShowThemeResponse>(`website-theme-settings/${id}`),
};

