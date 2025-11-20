import { ApiBaseResponse } from "@/types/common/response/base";

/**
 * Represents a Terms and Conditions entity
 * Contains the content and metadata for website terms and conditions
 */
export interface TermsConditions {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

/**
 * Response type for getting current terms and conditions
 * Follows Single Responsibility Principle - only defines response structure
 */
export interface GetCurrentTermsConditionsResponse
  extends ApiBaseResponse<TermsConditions> {}

