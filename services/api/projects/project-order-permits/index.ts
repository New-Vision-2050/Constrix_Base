import { baseApi } from "@/config/axios/instances/base";
import type {
  CreateProjectOrderPermitsArgs,
  ListOrderPermitTypesParams,
  ListProjectOrderPermitsParams,
  ListUdsWorkOrdersParams,
  UpdateProjectOrderPermitArgs,
} from "./types/params";
import type {
  CompletionDataResponse,
  CreateProjectOrderPermitsResponse,
  ImportProjectOrderPermitsResponse,
  ListProjectOrderPermitDepartmentsResponse,
  ListProjectOrderPermitTypesResponse,
  ListProjectOrderPermitsResponse,
  NoteLogsResponse,
  UdsWorkOrderResponse,
  UpdateProjectOrderPermitResponse,
} from "./types/response";

export const ProjectOrderPermitsApi = {
  list: (params?: ListOrderPermitTypesParams) =>
    baseApi.get<ListProjectOrderPermitTypesResponse>(
      "order-permits",
      params?.name?.trim()
        ? { params: { name: params.name.trim() } }
        : undefined,
    ),

  listForProject: (
    projectId: string | number,
    params?: ListProjectOrderPermitsParams,
  ) =>
    baseApi.get<ListProjectOrderPermitsResponse>(
      `projects/${projectId}/order-permits`,
      params?.order_permit_department_id != null
        ? {
            params: {
              order_permit_department_id: params.order_permit_department_id,
            },
          }
        : undefined,
    ),

  listDepartments: (orderPermitId: number | string) =>
    baseApi.get<ListProjectOrderPermitDepartmentsResponse>(
      "order-permit-departments",
      { params: { order_permit_id: orderPermitId } },
    ),

  listUdsWorkOrders: (
    projectId: string | number,
    params: ListUdsWorkOrdersParams,
  ) =>
    baseApi.get<UdsWorkOrderResponse>(
      `projects/${projectId}/order-permits/uds-work-orders`,
      {
        params: {
          name: params.name.trim(),
          order_permit_id: params.order_permit_id,
        },
      },
    ),

  create: (projectId: string, body: CreateProjectOrderPermitsArgs) =>
    baseApi.post<CreateProjectOrderPermitsResponse>(
      `projects/${projectId}/order-permits`,
      body,
    ),

  updateFromUds: (
    projectId: string | number,
    name: string,
    orderPermitId: number | string,
  ) =>
    baseApi.get<UpdateProjectOrderPermitResponse>(
      `projects/${projectId}/order-permits/${encodeURIComponent(name)}/update-from-uds`,
      { params: { order_permit_id: orderPermitId } },
    ),

  import: (projectId: string | number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return baseApi.post<ImportProjectOrderPermitsResponse>(
      `projects/${projectId}/order-permits/import`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
  },

  update: (
    projectId: string | number,
    id: string | number,
    body: UpdateProjectOrderPermitArgs,
  ) =>
    baseApi.put<UpdateProjectOrderPermitResponse>(
      `projects/${projectId}/order-permits/${id}`,
      body,
    ),

  getCompletionData: (projectOrderPermitId: string | number) =>
    baseApi.get<CompletionDataResponse>("completion-data", {
      params: { project_order_permit_id: projectOrderPermitId },
    }),

  getNoteLogs: (
    projectId: string | number,
    orderPermitId: string | number,
  ) =>
    baseApi.get<NoteLogsResponse>(
      `projects/${projectId}/order-permits/${orderPermitId}/note-logs`,
    ),
};
