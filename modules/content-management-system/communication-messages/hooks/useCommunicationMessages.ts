import { useQuery } from "@tanstack/react-query";
import { CommunicationMessagesApi } from "@/services/api/company-dashboard/communication-messages";

/**
 * Hook for fetching communication messages with caching
 * @param page - Current page number
 * @param limit - Items per page
 * @param search - Search query
 * @param status - Filter by status
 */
export default function useCommunicationMessages(
  page?: number,
  limit?: number,
  search?: string,
  status?: string
) {
  return useQuery({
    queryKey: ["communication-messages", page, limit, search, status],
    queryFn: () =>
      CommunicationMessagesApi.list({
        page: page || 1,
        limit: limit || 10,
        search,
        status,
      }),
    staleTime: 2 * 60 * 1000, // Fresh for 2 minutes
    gcTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

