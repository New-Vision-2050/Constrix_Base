import { baseApi } from "@/config/axios/instances/base";

export type MarkCompanyAsClientResponse = {
  code: string;
  message: string | null;
  payload: unknown;
};

/**
 * Marks an existing company as a client for the current tenant/context.
 */
export async function markCompanyAsClient(
  companyId: string,
): Promise<MarkCompanyAsClientResponse> {
  const id = encodeURIComponent(companyId.trim());
  const { data } = await baseApi.put<MarkCompanyAsClientResponse>(
    `/companies/${id}/mark-as-client`,
  );
  return data;
}
