import { baseApi } from "@/config/axios/instances/base";
import type {
  CreateProjectSharingProcedurePayload,
  UpdateProjectSharingProcedurePayload,
} from "./types/params";
import type {
  GetProjectSharingProcedureResponse,
  ListProjectSharingProceduresResponse,
  MutateProjectSharingProcedureResponse,
} from "./types/response";

export const ProjectSharingProcedureApi = {
  list: (projectTypeId: number | string) =>
    baseApi.get<ListProjectSharingProceduresResponse>(
      "order-permit-procedures",
      { params: { project_type_id: projectTypeId } },
    ),

  show: (procedureId: number | string) =>
    baseApi.get<GetProjectSharingProcedureResponse>(
      `order-permit-procedures/${procedureId}`,
    ),

  create: (body: CreateProjectSharingProcedurePayload) =>
    baseApi.post<MutateProjectSharingProcedureResponse>(
      "order-permit-procedures",
      body,
    ),

  update: (
    procedureId: number | string,
    body: UpdateProjectSharingProcedurePayload,
  ) =>
    baseApi.put<MutateProjectSharingProcedureResponse>(
      `order-permit-procedures/${procedureId}`,
      body,
    ),

  delete: (procedureId: number | string) =>
    baseApi.delete<MutateProjectSharingProcedureResponse>(
      `order-permit-procedures/${procedureId}`,
    ),
};
