import { apiClient, baseURL } from "@/config/axios-config";
import {
  CreateCustomerRequestArgs,
  UpdateCustomerRequestArgs,
  CustomerRequestListParams,
} from "./types";

// Re-export types
export * from "./types";

/**
 * Serialize data object to FormData
 * Handles arrays with [] suffix and File objects
 */
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
    apiClient.get(`${baseURL}/client-requests`, { params }),

  show: (id: string) => apiClient.get(`${baseURL}/client-requests/${id}`),

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
    return apiClient.post(`${baseURL}/client-requests`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
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
    return apiClient.post(`${baseURL}/client-requests/${id}`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  delete: (id: string) => apiClient.delete(`${baseURL}/client-requests/${id}`),

  // نوع الطلب
  getRequestTypes: () =>
    apiClient.get(`${baseURL}/client-requests/client-request-types`),

  // جهة الورود
  getSources: () =>
    apiClient.get(`${baseURL}/client-requests/client-request-receiver-from`),

  // اسم الخدمة
  getServices: () =>
    apiClient.get(`${baseURL}/client-requests/client-request-services`),

  // العميل
  getClients: (params?: { search?: string }) =>
    apiClient.get(`${baseURL}/company-users/clients`, { params }),

  // Term settings tree
  getTermSettings: () => apiClient.get(`${baseURL}/term-service-settings/all`),

  getStats: () => apiClient.get(`${baseURL}/client-requests/statistics`),
};
