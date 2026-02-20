import { baseApi } from "@/config/axios/instances/base";
import {
  CreateSecondLevelProjectTypeArgs,
  CreateThirdLevelProjectTypeArgs,
  UpdateDataSettingsArgs,
} from "./types/args";
import {
  CreateSecondLevelProjectTypeResponse,
  CreateThirdLevelProjectTypeResponse,
  GetDirectChildrenProjectTypesResponse,
  GetProjectTypeSchemasResponse,
  GetRootsProjectTypesResponse,
  GetDataSettingsResponse,
  UpdateDataSettingsResponse,
} from "./types/response";

export const ProjectTypesApi = {
  getRoots: () =>
    baseApi.get<GetRootsProjectTypesResponse>("project-types/roots"),
  getDirectChildren: (id: number | string) =>
    baseApi.get<GetDirectChildrenProjectTypesResponse>(
      `project-types/${id}/children`,
    ),
  getProjectTypeSchemas: (id: number | string) =>
    baseApi.get<GetProjectTypeSchemasResponse>(`project-types/${id}/children`),
  createSecondLevelProjectType: (args: CreateSecondLevelProjectTypeArgs) =>
    baseApi.post<CreateSecondLevelProjectTypeResponse>(`project-types`, args),
  createThirdLevelProjectType: (args: CreateThirdLevelProjectTypeArgs) =>
    baseApi.post<CreateThirdLevelProjectTypeResponse>(`project-types`, args),
  getDataSettings: (projectTypeId: number | string) =>
    baseApi.get<GetDataSettingsResponse>(
      `project-types/${projectTypeId}/data-settings`,
    ),
  updateDataSettings: (
    projectTypeId: number | string,
    args: UpdateDataSettingsArgs,
  ) =>
    baseApi.put<UpdateDataSettingsResponse>(
      `project-types/${projectTypeId}/data-settings`,
      args,
    ),
};
