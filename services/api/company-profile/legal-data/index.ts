import { baseApi } from "@/config/axios/instances/base";
import {
  CP_ListRegistrationTypesResponse,
  CP_CreateLegalDataResponse,
  CP_UpdateLegalDataResponse,
  CP_GetLegalDataResponse,
} from "./types/response";
import { CP_CreateLegalDataParams, CP_UpdateLegalDataParams } from "./types/params";
import { serialize } from "object-to-formdata";

export const CompanyProfileLegalDataApi = {
  // Fetch registration types
  getRegistrationTypes: (params?: { search?: string; page?: number }) =>
    baseApi.get<CP_ListRegistrationTypesResponse>("company_registration_types", {
      params,
    }),

  // Get legal data for a company/branch
  getLegalData: (params: { company_id?: string; branch_id?: string }) =>
    baseApi.get<CP_GetLegalDataResponse>(
      "companies/company-profile/legal-data",
      { params }
    ),

  // Create new legal data record
  create: (body: CP_CreateLegalDataParams, params: { company_id?: string; branch_id?: string }) => {
    const formData = serialize(body);
    return baseApi.post<CP_CreateLegalDataResponse>(
      "companies/company-profile/legal-data/create-legal-data",
      formData,
      {
        params,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  // Update legal data records
  update: (body: CP_UpdateLegalDataParams, params: { company_id?: string; branch_id?: string }) => {
    const formData = serialize(body, { indices: true });
    return baseApi.post<CP_UpdateLegalDataResponse>(
      "companies/company-profile/legal-data/update",
      formData,
      {
        params,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  // Delete legal data record
  delete: (id: string | number, params?: { company_id?: string; branch_id?: string }) =>
    baseApi.delete(`companies/company-profile/legal-data/${id}`, { params }),
};