import { baseApi } from "@/config/axios/instances/base";
import type { CreateProjectOrderPermitsArgs } from "./types/params";
import type {
  CreateProjectOrderPermitsResponse,
  ListProjectOrderPermitDepartmentsResponse,
  ListProjectOrderPermitsResponse,
} from "./types/response";

export const ProjectOrderPermitsApi = {
  list: () =>
    baseApi.get<ListProjectOrderPermitsResponse>("order-permits"),

  listForProject: (projectId: string | number) =>
    baseApi.get<ListProjectOrderPermitsResponse>(
      `projects/${projectId}/order-permits`,
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
};
