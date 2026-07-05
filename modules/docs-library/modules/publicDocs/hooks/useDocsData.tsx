import { useQuery } from "@tanstack/react-query";
import getDocs from "../apis/get-docs";
import { SearchFormData } from "../components/search-fields";
import {
  ProjectAttachmentsApi,
  type ProjectAttachmentsSearchFormData,
} from "@/services/api/projects/project-attachments";

/**
 * Folder contents for the public docs library, project attachments, or contractual engagement scope.
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
  isProject?: boolean,
  contractualEngagementKey?: string,
) {
  const isEngagementScope = Boolean(contractualEngagementKey);
  const isProjectScope = Boolean(projectId) && !isEngagementScope;

  return useQuery({
    queryKey: isEngagementScope
      ? [
          "docs",
          "contractual-engagement",
          contractualEngagementKey,
          branchId,
          parentId,
          password,
          limit,
          page,
          searchData,
          sort,
          fixedType,
        ]
      : isProjectScope
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
            isProject,
          ],
    queryFn: () => {
      if (isEngagementScope) {
        return ProjectAttachmentsApi.getFolderContents(
          undefined,
          branchId,
          parentId,
          password,
          limit,
          page,
          searchData as ProjectAttachmentsSearchFormData | undefined,
          sort,
          fixedType,
          contractualEngagementKey,
        );
      }
      if (isProjectScope) {
        return ProjectAttachmentsApi.getFolderContents(
          projectId,
          branchId,
          parentId,
          password,
          limit,
          page,
          searchData as ProjectAttachmentsSearchFormData | undefined,
          sort,
          fixedType,
        );
      }
      return getDocs(
        branchId,
        parentId,
        password,
        limit,
        page,
        searchData,
        sort,
        fixedType,
        isProject,
      );
    },
    enabled: isEngagementScope || isProjectScope || !projectId,
    refetchOnWindowFocus: false,
  });
}
