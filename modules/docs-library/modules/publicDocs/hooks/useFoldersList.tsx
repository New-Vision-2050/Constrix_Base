import { useQuery } from "@tanstack/react-query";
import getFoldersList from "../apis/get-folders-list";
import { ProjectAttachmentsApi } from "@/services/api/projects/project-attachments";

/**
 * Global folder list for copy/move, or project-scoped folders when `projectId` is set.
 */
export default function useFoldersList(projectId?: string) {
  return useQuery({
    queryKey: projectId ? ["folders", projectId] : ["folders"],
    queryFn: () =>
      projectId
        ? ProjectAttachmentsApi.getAllFolders(projectId)
        : getFoldersList(),
    enabled: projectId ? Boolean(projectId) : true,
    refetchOnWindowFocus: false,
  });
}
