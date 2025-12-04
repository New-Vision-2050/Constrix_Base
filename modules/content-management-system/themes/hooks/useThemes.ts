import { useQuery } from "@tanstack/react-query";
import { ThemesApi } from "@/services/api/company-dashboard/themes";

/**
 * Hook for fetching themes with caching
 * @param page - Current page number
 * @param limit - Items per page
 * @param search - Search query
 * @param category - Filter by category
 * @param sort - Sort option
 */
export default function useThemes(
  page?: number,
  limit?: number,
  search?: string,
  category?: string,
  sort?: string
) {
  return useQuery({
    queryKey: ["themes", page, limit, search, category, sort],
    queryFn: () =>
      ThemesApi.list({
        page: page || 1,
        limit: limit || 10,
        search,
        category,
        sort,
      }),
    staleTime: 5 * 60 * 1000, // Fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Cache for 10 minutes
  });
}

