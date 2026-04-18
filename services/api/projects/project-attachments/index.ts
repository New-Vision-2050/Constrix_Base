import { apiClient } from "@/config/axios-config";
import type { SelectOption } from "@/types/select-option";
import type { ProjectAttachmentsSearchFormData } from "./types/params";
import type {
  CopyMoveFileRequest,
  ProjectFolderContentsPagination,
  ProjectFolderContentsPayload,
} from "./types/response";

type FolderContentsResponse = {
  code: string;
  message: string;
  pagination: ProjectFolderContentsPagination;
  payload: ProjectFolderContentsPayload;
};

type GenericPayloadResponse<T> = {
  code: string;
  message: string;
  payload: T;
};

/**
 * Project-scoped attachments / library folder APIs (used on project detail tabs).
 */
export const ProjectAttachmentsApi = {
  
  getFolderContents: async (
    projectId: string,
    branchId?: string,
    parentId?: string,
    password?: string,
    limit?: number,
    page?: number,
    searchData?: ProjectAttachmentsSearchFormData,
    sort?: string,
    fixedType?: string,
  ): Promise<{
    payload: ProjectFolderContentsPayload;
    pagination: ProjectFolderContentsPagination;
  }> => {
    const params: Record<string, string | number> = {};

    params.parent_id = parentId ?? projectId;
    if (branchId && branchId !== "all") params.branch_id = branchId;
    if (password?.length) params.password = password;
    if (limit) params.per_page = limit;
    if (page) params.page = page;

    if (fixedType) {
      params.type = fixedType;
    } else if (searchData?.type && searchData.type !== "all") {
      params.type = searchData.type;
    }
    if (searchData?.documentType && searchData.documentType !== "all") {
      params.document_type = searchData.documentType;
    }
    if (searchData?.endDate) {
      params.end_date = searchData.endDate;
    }

    if (searchData?.search?.length) {
      params.search = searchData.search;
    }
    if (sort) params.sort = sort;

    params.withoutTenancy = 1;
    params.project_id = projectId;

    const res = await apiClient.get<FolderContentsResponse>(`/folders/contents`, {
      params,
    });

    return { payload: res.data.payload, pagination: res.data.pagination };
  },

  /**
   * Lists folders for copy/move targets (`parent_id` = project or folder id).
   */
  getAllFolders: async (projectId: string): Promise<SelectOption[]> => {
    const res = await apiClient.get<GenericPayloadResponse<SelectOption[]>>(
      `/folders/get-all-folders`,
      {
        params: { parent_id: projectId },
      },
    );
    return res.data.payload;
  },

  getUsers: async (): Promise<SelectOption[]> => {
    const res =
      await apiClient.get<GenericPayloadResponse<SelectOption[]>>(`/users`);
    return res.data.payload;
  },

  copyFiles: async (data: CopyMoveFileRequest) => {
    const res = await apiClient.post(`/files/copy`, data);
    return res.data;
  },

  moveFiles: async (data: CopyMoveFileRequest) => {
    const res = await apiClient.post(`/files/cut`, data);
    return res.data;
  },
};

export type {
  ProjectAttachmentsSearchFormData,
} from "./types/params";
export type {
  CopyMoveFileRequest,
  ProjectFolderContentsPagination,
  ProjectFolderContentsPayload,
} from "./types/response";
