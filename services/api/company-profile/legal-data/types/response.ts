import { CP_RegistrationType, CP_LegalDataRecord } from "@/types/api/company-profile/legal-data";
import { ApiBaseResponse } from "@/types/common/response/base";
import { ApiPaginatedResponse } from "@/types/common/response/paginated";

// Registration Types List Response
export interface CP_ListRegistrationTypesResponse
  extends ApiPaginatedResponse<CP_RegistrationType[]> {}

// Create Legal Data Response
export interface CP_CreateLegalDataResponse extends ApiBaseResponse<CP_LegalDataRecord[]> {}

// Update Legal Data Response
export interface CP_UpdateLegalDataResponse extends ApiBaseResponse<CP_LegalDataRecord[]> {}

// Get Legal Data Response
export interface CP_GetLegalDataResponse
  extends ApiBaseResponse<CP_LegalDataRecord[]> {}
