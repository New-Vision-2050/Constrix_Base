import { CommunicationMessage } from "@/modules/content-management-system/communication-messages/types";
import { ApiBaseResponse } from "@/types/common/response/base";
import { ApiPaginatedResponse } from "@/types/common/response/paginated";

/**
 * API responses for communication messages
 */
export interface ListMessagesResponse
  extends ApiPaginatedResponse<CommunicationMessage[]> {}

export interface ShowMessageResponse
  extends ApiBaseResponse<CommunicationMessage> {}

