import { baseApi } from "@/config/axios/instances/base";
import type {
  CreateProjectSharingWorkOrderPayload,
  UpdateProjectSharingWorkOrderPayload,
} from "./types/params";
import type {
  GetProjectSharingWorkOrderResponse,
  ListProjectSharingWorkOrdersResponse,
  MutateProjectSharingWorkOrderResponse,
} from "./types/response";

export const ProjectSharingWorkOrdersApi = {
  list: (projectTypeId: number | string) =>
    baseApi.get<ListProjectSharingWorkOrdersResponse>("/order-permits", {
      params: { project_type_id: projectTypeId },
    }),

  show: (workOrderId: number | string) =>
    baseApi.get<GetProjectSharingWorkOrderResponse>(
      `order-permits/${workOrderId}`,
    ),

  create: (body: CreateProjectSharingWorkOrderPayload) =>
    baseApi.post<MutateProjectSharingWorkOrderResponse>("order-permits", body),

  update: (
    workOrderId: number | string,
    body: UpdateProjectSharingWorkOrderPayload,
  ) =>
    baseApi.put<MutateProjectSharingWorkOrderResponse>(
      `order-permits/${workOrderId}`,
      body,
    ),

  delete: (workOrderId: number | string) =>
    baseApi.delete<MutateProjectSharingWorkOrderResponse>(
      `order-permits/${workOrderId}`,
    ),
};
