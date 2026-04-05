import { useQuery } from "@tanstack/react-query";
import { ProjectAttachmentsApi } from "@/services/api/projects/project-attachments";

export default function useProjectFoldersList(projectId: string) {
  return useQuery({
    queryKey: ["project-attachments-folders-list", projectId],
    queryFn: () => ProjectAttachmentsApi.getAllFolders(projectId),
    enabled: Boolean(projectId),
    refetchOnWindowFocus: false,
  });
}
