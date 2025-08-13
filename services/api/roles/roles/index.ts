import { baseApi } from "@/config/axios/instances/base";
import { ListRolesResponse, ShowRoleResponse } from "./types/response";
import { CreateRoleParams, UpdateRoleParams } from "./types/params";

export const RolesApi = {
  list: () => baseApi.get<ListRolesResponse>("role_and_permissions/roles"),
  show: (id: string) =>
    baseApi.get<ShowRoleResponse>(`role_and_permissions/roles/${id}`),
  create: (params: CreateRoleParams) =>
    baseApi.post("role_and_permissions/roles", params),
  update: (id: string, params: UpdateRoleParams) =>
    baseApi.put(`role_and_permissions/roles/${id}`, params),
};
