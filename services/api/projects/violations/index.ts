import { baseApi } from "@/config/axios/instances/base";
import type { ListProjectViolationsResponse } from "./types/response";

export const ProjectViolationsApi = {
  listCatalog: () =>
    baseApi.get<ListProjectViolationsResponse>("projects/violations"),
};
