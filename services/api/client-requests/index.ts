import type { AxiosRequestConfig } from "axios";
import { baseApi } from "@/config/axios/instances/base";
import {
  CreateClientRequestArgs,
  UpdateClientRequestArgs,
  UpdateClientRequestStatusBody,
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
  GetPriceOffersWidgetsResponse,
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

/**
 * Laravel expects `receiver_employee_ids` as an array. Sending a JSON string
 * fails validation ("must be an array"). Use repeated `receiver_employee_ids[]`
 * keys in multipart form data.
 */
function appendReceiverEmployeeIdsToForm(
  form: FormData,
  ids: string[] | undefined,
) {
  if (ids === undefined || ids.length === 0) return;
  for (const id of ids) {
    if (id !== undefined && id !== null && String(id).trim() !== "") {
      form.append("receiver_employee_ids[]", String(id));
    }
  }
}

export const ClientRequestsApi = {
  list: (params?: ClientRequestListParams) =>
    baseApi.get<ListClientRequestsResponse>("client-requests", { params }),

  show: (id: string) =>
    baseApi.get<ShowClientRequestResponse>(`client-requests/${id}`),

  create: (
    args: CreateClientRequestArgs,
    requestConfig?: Pick<AxiosRequestConfig, "onUploadProgress">,
  ) => {
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
      reject_cause: args.reject_cause,
    });
    appendReceiverEmployeeIdsToForm(form, args.receiver_employee_ids);
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
      ...requestConfig,
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
      reject_cause: args.reject_cause,
    });
    appendReceiverEmployeeIdsToForm(form, args.receiver_employee_ids);
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

  updateStatus: (id: string, body: UpdateClientRequestStatusBody) =>
    baseApi.patch<ShowClientRequestResponse>(`client-requests/${id}/status`, {
      status_client_request: body.status_client_request,
      ...(body.status_client_request === "rejected"
        ? { reject_cause: body.reject_cause ?? "" }
        : {}),
    }),

  getRequestTypes: (searchText?: string) =>
    baseApi.get(searchText ? `client-requests/client-request-types?name=${searchText}` : "client-requests/client-request-types"),

  getSources: (searchText?: string) =>
    baseApi.get(searchText ? `client-requests/client-request-receiver-from?name=${searchText}` : "client-requests/client-request-receiver-from"),

  getServices: () =>
    baseApi.get<GetServicesResponse>("client-requests/client-request-services"),

  getClients: (params?: { search?: string }) =>
    baseApi.get<GetClientsResponse>("company-users/clients", { params }),

  getTermSettings: () =>
    baseApi.get<GetTermSettingsResponse>("term-service-settings/all"),

  getStats: () =>
    baseApi.get<GetStatsResponse>("client-requests/status/widgets"),

  getBranches: (searchText?: string) =>
    baseApi.get(searchText ? `management_hierarchies/list?type=branch&name=${searchText}` : "management_hierarchies/list?type=branch"),

  getManagements: (branchId?: string, searchText?: string) => {
    let url = "management_hierarchies/list?type=management";
    const params = [];
    
    if (branchId) params.push(`branch_id=${branchId}`);
    if (searchText) params.push(`name=${searchText}`);
    
    if (params.length > 0) {
      url += `&${params.join('&')}`;
    }
    
    return baseApi.get(url);
  },
  getPriceOffersWidgets: () => baseApi.get<GetPriceOffersWidgetsResponse>("client-requests/price-offer/widgets"),
};
