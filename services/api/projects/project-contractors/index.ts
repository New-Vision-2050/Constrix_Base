import { baseApi } from "@/config/axios/instances/base";
import type {
  CreateProjectContractorArgs,
  UpdateProjectContractorArgs,
} from "./types/args";
import {
  CreateProjectContractorResponse,
  DeleteProjectContractorResponse,
  GetProjectContractorResponse,
  ListProjectContractorsResponse,
  UpdateProjectContractorResponse,
} from "./types/response";

export const ProjectContractorsApi = {
  listForProject: (
    projectId: string | number,
    params?: { search?: string },
  ) =>
    baseApi.get<ListProjectContractorsResponse>(
      `projects/${projectId}/project-contractors`,
      {
        params: params?.search?.trim()
          ? { search: params.search.trim() }
          : undefined,
      },
    ),

  getForProject: (projectId: string | number, contractorId: string | number) =>
    baseApi.get<GetProjectContractorResponse>(
      `projects/${projectId}/project-contractors/${contractorId}`,
    ),

  createForProject: (
    projectId: string | number,
    body: CreateProjectContractorArgs,
  ) =>
    baseApi.post<CreateProjectContractorResponse>(
      `projects/${projectId}/project-contractors`,
      body,
    ),

  updateForProject: (
    projectId: string | number,
    contractorId: string | number,
    body: UpdateProjectContractorArgs,
  ) =>
    baseApi.put<UpdateProjectContractorResponse>(
      `projects/${projectId}/project-contractors/${contractorId}`,
      body,
    ),

  deleteFromProject: (
    projectId: string | number,
    contractorId: string | number,
  ) =>
    baseApi.delete<DeleteProjectContractorResponse>(
      `projects/${projectId}/project-contractors/${contractorId}`,
    ),
};
