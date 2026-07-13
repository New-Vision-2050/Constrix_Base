import { useQuery } from "@tanstack/react-query";
import { ProjectContractorsApi } from "@/services/api/projects/project-contractors";
import type { ContractorRow } from "@/modules/projects/project/components/project-tabs/tabs/contractors/types";
import { mapProjectContractorDto } from "./mapProjectContractor";

export const projectContractorsQueryKey = (
  projectId: string,
  search?: string,
) => ["project-contractors", projectId, search ?? ""] as const;

export function useProjectContractors(
  projectId: string | undefined,
  options?: { search?: string },
) {
  const search = options?.search?.trim() || undefined;

  return useQuery({
    queryKey: projectId
      ? projectContractorsQueryKey(projectId, search)
      : ["project-contractors", ""],
    queryFn: async () => {
      const res = await ProjectContractorsApi.listForProject(projectId!, {
        search,
      });
      const payload = res.data?.payload;
      if (!Array.isArray(payload)) {
        return [] as ContractorRow[];
      }
      return payload.map(mapProjectContractorDto);
    },
    enabled: !!projectId,
    retry: false,
  });
}
