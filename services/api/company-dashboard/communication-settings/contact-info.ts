import { baseApi } from "@/config/axios/instances/base";
import { GetContactInfoResponse } from "./types/response";
import { UpdateContactInfoParams } from "./types/params";

/**
 * Communication Website Contact Info API
 * Handles operations for contact info management
 */
export const CommunicationWebsiteContactInfoApi = {
  /**
   * Get current contact info
   */
  getCurrent: () =>
    baseApi.get<GetContactInfoResponse>("website-contact-info/current"),

  /**
   * Update current contact info
   */
  update: (body: UpdateContactInfoParams) =>
    baseApi.put("website-contact-info/current", body),
};

