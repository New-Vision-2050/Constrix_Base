import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  ProjectStampApi,
  resolveProjectStampUrl,
} from "@/services/api/projects/project-stamp";

export const projectStampQueryKey = (projectId?: string) =>
  projectId
    ? (["project-stamp", projectId] as const)
    : (["project-stamp"] as const);

export function useProjectStamp(projectId: string | undefined) {
  return useQuery({
    queryKey: projectStampQueryKey(projectId),
    queryFn: async () => {
      try {
        const res = await ProjectStampApi.get(projectId!);
        const payload = res.data?.payload;
        return {
          raw: payload ?? null,
          url: resolveProjectStampUrl(payload),
        };
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return { raw: null, url: null };
        }
        throw error;
      }
    },
    enabled: !!projectId,
    retry: false,
  });
}
