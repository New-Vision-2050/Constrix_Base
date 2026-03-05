import { baseApi } from "@/config/axios/instances/base";
import {
  CreateClientRequestArgs,
  UpdateClientRequestArgs,
  ClientRequestListParams,
  ListClientRequestsResponse,
  ShowClientRequestResponse,
  CreateClientRequestResponse,
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

export const ClientRequestsApi = {
  list: (params?: ClientRequestListParams) =>
    baseApi.get<ListClientRequestsResponse>("client-requests", { params }),

  show: (id: string) =>
    baseApi.get<ShowClientRequestResponse>(`client-requests/${id}`),

  create: (args: CreateClientRequestArgs) => {
    const form = toFormData({
      client_request_type_id: args.client_request_type_id,
      client_request_receiver_from_id: args.client_request_receiver_from_id,
      client_type: args.client_type,
      client_id: args.client_id,
      content: args.content,
      status_client_request: args.status_client_request,
      service_ids: args.service_ids,
      branch_id: args.branch_id,
      management_id: args.management_id,
      attachments: args.attachments,
      receiver_phone: args.receiver_phone,
      receiver_email: args.receiver_email,
      receiver_employee_id: args.receiver_employee_id,
      receiver_broker_id: args.receiver_broker_id,
      receiver_broker_type: args.receiver_broker_type,
    });
    args.term_setting_id?.forEach((entry, i) => {
      form.append(
        `term_setting_ids[${i}][term_service_id]`,
        String(entry.term_service_id),
      );
      entry.term_ids.forEach((id) => {
        form.append(`term_setting_ids[${i}][term_ids][]`, String(id));
      });
    });
    return baseApi.post<CreateClientRequestResponse>("client-requests", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  update: (id: string, args: UpdateClientRequestArgs) => {
    const form = toFormData({
      client_request_type_id: args.client_request_type_id,
      client_request_receiver_from_id: args.client_request_receiver_from_id,
      client_type: args.client_type,
      client_id: args.client_id,
      content: args.content,
      status_client_request: args.status_client_request,
      service_ids: args.service_ids,
      branch_id: args.branch_id,
      management_id: args.management_id,
      attachments: args.attachments,
      receiver_phone: args.receiver_phone,
      receiver_email: args.receiver_email,
      receiver_employee_id: args.receiver_employee_id,
      receiver_broker_id: args.receiver_broker_id,
      receiver_broker_type: args.receiver_broker_type,
    });
    args.term_setting_id?.forEach((entry, i) => {
      form.append(
        `term_setting_id[${i}][term_service_id]`,
        String(entry.term_service_id),
      );
      entry.term_ids.forEach((termId) => {
        form.append(`term_setting_id[${i}][term_ids][]`, String(termId));
      });
    });
    return baseApi.post<CreateClientRequestResponse>(
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

  getBranches: () =>
    baseApi.get("management_hierarchies/list?type=branch"),

  getManagements: (branchId?: string) =>
    baseApi.get(branchId ? `management_hierarchies/list?type=management&branch_id=${branchId}` : "management_hierarchies/list?type=management"),
};
