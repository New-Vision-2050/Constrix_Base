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
    baseApi.get<ListProjectSharingWorkOrdersResponse>(
      "project-sharing-work-orders",
      { params: { project_type_id: projectTypeId } },
    ),

  show: (workOrderId: number | string) =>
    baseApi.get<GetProjectSharingWorkOrderResponse>(
      `project-sharing-work-orders/${workOrderId}`,
    ),

  create: (body: CreateProjectSharingWorkOrderPayload) =>
    baseApi.post<MutateProjectSharingWorkOrderResponse>(
      "project-sharing-work-orders",
      body,
    ),

  update: (
    workOrderId: number | string,
    body: UpdateProjectSharingWorkOrderPayload,
  ) =>
    baseApi.put<MutateProjectSharingWorkOrderResponse>(
      `project-sharing-work-orders/${workOrderId}`,
      body,
    ),

  delete: (workOrderId: number | string) =>
    baseApi.delete<MutateProjectSharingWorkOrderResponse>(
      `project-sharing-work-orders/${workOrderId}`,
    ),
};
