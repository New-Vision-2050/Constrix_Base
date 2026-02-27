import { baseApi } from "@/config/axios/instances/base";
import {
  CreateSecondLevelProjectTypeArgs,
  CreateThirdLevelProjectTypeArgs,
} from "./types/args";
import {
  CreateSecondLevelProjectTypeResponse,
  CreateThirdLevelProjectTypeResponse,
  GetDirectChildrenProjectTypesResponse,
  GetProjectTypeSchemasResponse,
  GetRootsProjectTypesResponse,
} from "./types/response";

export const ProjectTypesApi = {
  getRoots: () =>
    baseApi.get<GetRootsProjectTypesResponse>("project-types/roots"),
  getDirectChildren: (id: number | string) =>
    baseApi.get<GetDirectChildrenProjectTypesResponse>(
      `project-types/${id}/children`,
    ),
  getProjectTypeSchemas: (id: number | string) =>
    baseApi.get<GetProjectTypeSchemasResponse>(`project-types/${id}/schemas`),
  createSecondLevelProjectType: (args: CreateSecondLevelProjectTypeArgs) =>
    baseApi.post<CreateSecondLevelProjectTypeResponse>(
      `project-types/second-level`,
      args,
    ),
  createThirdLevelProjectType: (args: CreateThirdLevelProjectTypeArgs) =>
    baseApi.post<CreateThirdLevelProjectTypeResponse>(`project-types`, args),
};
