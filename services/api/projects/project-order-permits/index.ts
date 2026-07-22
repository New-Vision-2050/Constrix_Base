import { baseApi } from "@/config/axios/instances/base";
import type {
  CreateProjectOrderPermitsArgs,
  ListProjectOrderPermitsParams,
} from "./types/params";
import type {
  CreateProjectOrderPermitsResponse,
  ImportProjectOrderPermitsResponse,
  ListProjectOrderPermitDepartmentsResponse,
  ListProjectOrderPermitsResponse,
} from "./types/response";

export const ProjectOrderPermitsApi = {
  list: () =>
    baseApi.get<ListProjectOrderPermitsResponse>("order-permits"),

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

  create: (projectId: string, body: CreateProjectOrderPermitsArgs) =>
    baseApi.post<CreateProjectOrderPermitsResponse>(
      `projects/${projectId}/order-permits`,
      body,
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
};
