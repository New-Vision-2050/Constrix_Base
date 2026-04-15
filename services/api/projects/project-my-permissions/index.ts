import { baseApi } from "@/config/axios/instances/base";
import { ProjectMyPermissionsFlatResponse } from "./types/response";

export const ProjectMyPermissionsApi = {
  flat: (projectId: string) =>
    baseApi.get<ProjectMyPermissionsFlatResponse>(
      `projects/${projectId}/my-permissions/flat`,
    ),
};
