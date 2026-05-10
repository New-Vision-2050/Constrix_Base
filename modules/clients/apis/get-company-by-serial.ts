import { apiClient } from "@/config/axios-config";
import type { CompanyLookupResponse } from "@/services/api/projects/project-sharing/types/response";

export const COMPANY_LOOKUP_SUCCESS_CODE = "SUCCESS_WITH_SINGLE_PAYLOAD_OBJECT";

export async function getCompanyBySerialNumber(
  serial: string,
): Promise<CompanyLookupResponse> {
  const trimmed = serial.trim();
  const { data } = await apiClient.get<CompanyLookupResponse>(
    "/companies/by-serial-number",
    {
      params: { serial_number: trimmed },
    },
  );
  return data;
}
