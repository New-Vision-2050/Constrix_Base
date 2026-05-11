import { baseApi } from "@/config/axios/instances/base";
import type {
  CreateProjectSharingTaskSettingPayload,
  UpdateProjectSharingTaskSettingPayload,
} from "./types/params";
import type {
  GetProjectSharingTaskSettingResponse,
  ListProjectSharingTaskSettingsResponse,
  MutateProjectSharingTaskSettingResponse,
} from "./types/response";

export const ProjectSharingTaskSettingApi = {
  list: (projectTypeId: number | string) =>
    baseApi.get<ListProjectSharingTaskSettingsResponse>(
      "project-sharing-tasks-setting",
      { params: { project_type_id: projectTypeId } },
    ),

  show: (id: number | string) =>
    baseApi.get<GetProjectSharingTaskSettingResponse>(
      `project-sharing-tasks-setting/${id}`,
    ),

  create: (body: CreateProjectSharingTaskSettingPayload) =>
    baseApi.post<MutateProjectSharingTaskSettingResponse>(
      "project-sharing-tasks-setting",
      body,
    ),

  update: (
    id: number | string,
    body: UpdateProjectSharingTaskSettingPayload,
  ) =>
    baseApi.put<MutateProjectSharingTaskSettingResponse>(
      `project-sharing-tasks-setting/${id}`,
      body,
    ),

  delete: (id: number | string) =>
    baseApi.delete<MutateProjectSharingTaskSettingResponse>(
      `project-sharing-tasks-setting/${id}`,
    ),
};
