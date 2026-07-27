import { baseApi } from "@/config/axios/instances/base";
import type {
  CreateProjectDistrictArgs,
  UpdateProjectDistrictArgs,
} from "./types/args";
import type {
  CreateProjectDistrictResponse,
  DeleteProjectDistrictResponse,
  GetProjectDistrictResponse,
  ListProjectDistrictsResponse,
  UpdateProjectDistrictResponse,
} from "./types/response";

export const ProjectDistrictsApi = {
  list: () =>
    baseApi.get<ListProjectDistrictsResponse>("projects-districts"),

  get: (id: number | string) =>
    baseApi.get<GetProjectDistrictResponse>(
      `projects-districts/${id}`,
    ),

  create: (body: CreateProjectDistrictArgs) =>
    baseApi.post<CreateProjectDistrictResponse>(
      "projects-districts",
      body,
    ),

  update: (id: number | string, body: UpdateProjectDistrictArgs) =>
    baseApi.put<UpdateProjectDistrictResponse>(
      `projects-districts/${id}`,
      body,
    ),

  delete: (id: number | string) =>
    baseApi.delete<DeleteProjectDistrictResponse>(
      `projects-districts/${id}`,
    ),
};
