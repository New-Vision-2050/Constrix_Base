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
      "project-sharing-procedure",
      { params: { project_type_id: projectTypeId } },
    ),

  show: (procedureId: number | string) =>
    baseApi.get<GetProjectSharingProcedureResponse>(
      `project-sharing-procedure/${procedureId}`,
    ),

  create: (body: CreateProjectSharingProcedurePayload) =>
    baseApi.post<MutateProjectSharingProcedureResponse>(
      "project-sharing-procedure",
      body,
    ),

  update: (
    procedureId: number | string,
    body: UpdateProjectSharingProcedurePayload,
  ) =>
    baseApi.put<MutateProjectSharingProcedureResponse>(
      `project-sharing-procedure/${procedureId}`,
      body,
    ),

  delete: (procedureId: number | string) =>
    baseApi.delete<MutateProjectSharingProcedureResponse>(
      `project-sharing-procedure/${procedureId}`,
    ),
};
