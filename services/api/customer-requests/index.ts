import { baseApi } from "@/config/axios/instances/base";
import {
  CreateCustomerRequestArgs,
  UpdateCustomerRequestArgs,
  CustomerRequestListParams,
  ListCustomerRequestsResponse,
  ShowCustomerRequestResponse,
  CreateCustomerRequestResponse,
  GetRequestTypesResponse,
  GetSourcesResponse,
  GetServicesResponse,
  GetClientsResponse,
  GetTermSettingsResponse,
  GetStatsResponse,
} from "./types";

export * from "./types";

function toFormData(
  data: Record<string, unknown>,
  options?: { skipNull?: boolean },
): FormData {
  const form = new FormData();
  const skipNull = options?.skipNull ?? true;

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined) return;
    if (skipNull && value === null) return;

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item instanceof File) {
          form.append(`${key}[]`, item);
        } else if (item !== undefined && item !== null) {
          form.append(`${key}[]`, String(item));
        }
      });
    } else if (value instanceof File) {
      form.append(key, value);
    } else if (value !== null) {
      form.append(key, String(value));
    }
  });

  return form;
}

export const CustomerRequestsApi = {
  list: (params?: CustomerRequestListParams) =>
    baseApi.get<ListCustomerRequestsResponse>("client-requests", { params }),

  show: (id: string) =>
    baseApi.get<ShowCustomerRequestResponse>(`client-requests/${id}`),

  create: (args: CreateCustomerRequestArgs) => {
    const form = toFormData({
      client_request_type_id: args.client_request_type_id,
      client_request_receiver_from_id: args.client_request_receiver_from_id,
      client_type: args.client_type,
      client_id: args.client_id,
      content: args.content,
      status_client_request: args.status_client_request,
      service_ids: args.service_ids,
      term_setting_id: args.term_setting_id,
      branch_id: args.branch_id,
      management_id: args.management_id,
      attachments: args.attachments,
    });
    return baseApi.post<CreateCustomerRequestResponse>(
      "client-requests",
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
  },

  update: (id: string, args: UpdateCustomerRequestArgs) => {
    const form = toFormData({
      client_request_type_id: args.client_request_type_id,
      client_request_receiver_from_id: args.client_request_receiver_from_id,
      client_type: args.client_type,
      client_id: args.client_id,
      content: args.content,
      status_client_request: args.status_client_request,
      service_ids: args.service_ids,
      term_setting_id: args.term_setting_id,
      branch_id: args.branch_id,
      management_id: args.management_id,
      attachments: args.attachments,
    });
    return baseApi.post<CreateCustomerRequestResponse>(
      `client-requests/${id}`,
      form,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  },

  delete: (id: string) => baseApi.delete(`client-requests/${id}`),

  getRequestTypes: () =>
    baseApi.get<GetRequestTypesResponse>(
      "client-requests/client-request-types",
    ),

  getSources: () =>
    baseApi.get<GetSourcesResponse>(
      "client-requests/client-request-receiver-from",
    ),

  getServices: () =>
    baseApi.get<GetServicesResponse>("client-requests/client-request-services"),

  getClients: (params?: { search?: string }) =>
    baseApi.get<GetClientsResponse>("company-users/clients", { params }),

  getTermSettings: () =>
    baseApi.get<GetTermSettingsResponse>("term-service-settings/all"),

  getStats: () =>
    baseApi.get<GetStatsResponse>("client-requests/status/widgets"),
};
