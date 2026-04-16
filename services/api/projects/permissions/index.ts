import { baseApi } from "@/config/axios/instances/base";
import { GetProjectPermissionsResponse } from "./types/response";

export const ProjectPermissionsApi = {
  getMyPermissions: (projectId: string) =>
    baseApi.get<GetProjectPermissionsResponse>(
      `projects/${projectId}/my-permissions`
    ),
};
