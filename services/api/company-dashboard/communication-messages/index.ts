import { baseApi } from "@/config/axios/instances/base";
import { ListMessagesResponse, ShowMessageResponse } from "./types/response";
import { ReplyMessageParams } from "./types/params";

/**
 * Communication Messages API service
 * Handles fetching and replying to contact messages
 */
export const CommunicationMessagesApi = {
  /**
   * List all messages with pagination and filters
   */
  list: (params?: { search?: string; page?: number; limit?: number; status?: string }) =>
    baseApi.get<ListMessagesResponse>("communication-messages", { params }),

  /**
   * Get single message details
   */
  show: (id: string) =>
    baseApi.get<ShowMessageResponse>(`communication-messages/${id}`),

  /**
   * Reply to a message
   */
  reply: (id: string, body: ReplyMessageParams) =>
    baseApi.post(`communication-messages/${id}/reply`, body),

  /**
   * Delete a message
   */
  delete: (id: string) => baseApi.delete(`communication-messages/${id}`),
};

