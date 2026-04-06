import { useQuery } from "@tanstack/react-query";
import getDocs from "../apis/get-docs";
import { SearchFormData } from "../components/search-fields";
import {
  ProjectAttachmentsApi,
  type ProjectAttachmentsSearchFormData,
} from "@/services/api/projects/project-attachments";

/**
 * Folder contents for the public docs library, or project attachments when `projectId` is set.
 */
export default function useDocsData(
  branchId?: string,
  parentId?: string,
  password?: string,
  limit?: number,
  page?: number,
  searchData?: SearchFormData | ProjectAttachmentsSearchFormData,
  sort?: string,
  fixedType?: string,
  projectId?: string,
) {
  return useQuery({
    queryKey: projectId
      ? [
          "docs",
          "project",
          projectId,
          branchId,
          parentId,
          password,
          limit,
          page,
          searchData,
          sort,
          fixedType,
        ]
      : [
          "docs",
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
      projectId
        ? ProjectAttachmentsApi.getFolderContents(
            projectId,
            branchId,
            parentId,
            password,
            limit,
            page,
            searchData as ProjectAttachmentsSearchFormData | undefined,
            sort,
            fixedType,
          )
        : getDocs(
            branchId,
            parentId,
            password,
            limit,
            page,
            searchData,
            sort,
            fixedType,
          ),
    enabled: projectId ? Boolean(projectId) : true,
    refetchOnWindowFocus: false,
  });
}
