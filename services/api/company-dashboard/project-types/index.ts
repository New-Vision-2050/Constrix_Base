import { baseApi } from "@/config/axios/instances/base";
import { ListProjectTypesResponse, ShowProjectTypeResponse } from "./types/response";
import { CreateProjectTypeParams, UpdateProjectTypeParams } from "./types/params";

export const CompanyDashboardProjectTypesApi = {
  list: (params?: { search?: string }) =>
    baseApi.get<ListProjectTypesResponse>("website-project-settings", {
      params,
    }),
  show: (id: string) =>
    baseApi.get<ShowProjectTypeResponse>(
      `website-project-settings/${id}`
    ),
  create: (body: CreateProjectTypeParams) => {
    return baseApi.post("website-project-settings", body);
  },
  update: (id: string, body: UpdateProjectTypeParams) => {
    return baseApi.put(`website-project-settings/${id}`, body);
  },
  delete: (id: string) =>
    baseApi.delete(`website-project-settings/${id}`),
};

