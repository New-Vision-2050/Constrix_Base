import { baseApi } from "@/config/axios/instances/base";
import type { CreateProjectOrderPermitsArgs } from "./types/params";
import type {
  CreateProjectOrderPermitsResponse,
  ListProjectOrderPermitsResponse,
} from "./types/response";

export const ProjectOrderPermitsApi = {
  list: (projectId: string) =>
    baseApi.get<ListProjectOrderPermitsResponse>(
      `projects/${projectId}/order-permits`,
    ),

  create: (projectId: string, body: CreateProjectOrderPermitsArgs) =>
    baseApi.post<CreateProjectOrderPermitsResponse>(
      `projects/${projectId}/order-permits`,
      body,
    ),
};
