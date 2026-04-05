import { useQuery } from "@tanstack/react-query";
import { ProjectAttachmentsApi } from "@/services/api/projects/project-attachments";

export default function useProjectUsersData() {
  return useQuery({
    queryKey: ["project-attachments-users-list"],
    queryFn: () => ProjectAttachmentsApi.getUsers(),
    refetchOnWindowFocus: false,
  });
}
