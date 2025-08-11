import { baseApi } from "@/config/axios/instances/base";
import { GetPermissionsLookupsResponse } from "./types/response";

export const PermissionsApi = {
  lookups: () =>
    baseApi.get<GetPermissionsLookupsResponse>(
      "role_and_permissions/permissions/lookup"
    ),
};
