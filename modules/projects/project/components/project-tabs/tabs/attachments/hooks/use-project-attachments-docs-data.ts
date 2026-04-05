import { useQuery } from "@tanstack/react-query";
import {
  ProjectAttachmentsApi,
  type ProjectAttachmentsSearchFormData,
} from "@/services/api/projects/project-attachments";

export default function useProjectAttachmentsDocsData(
  projectId: string,
  branchId?: string,
  parentId?: string,
  password?: string,
  limit?: number,
  page?: number,
  searchData?: ProjectAttachmentsSearchFormData,
  sort?: string,
  fixedType?: string,
) {
  return useQuery({
    queryKey: [
      "project-attachments-docs",
      projectId,
      branchId,
      parentId,
      password,
      limit,
      page,
      searchData,
      sort,
      fixedType,
    ],
    queryFn: () =>
      ProjectAttachmentsApi.getFolderContents(
        projectId,
        branchId,
        parentId,
        password,
        limit,
        page,
        searchData,
        sort,
        fixedType,
      ),
    enabled: Boolean(projectId),
    refetchOnWindowFocus: false,
  });
}
