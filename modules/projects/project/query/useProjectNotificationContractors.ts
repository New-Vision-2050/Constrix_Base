"use client";

import { useQuery } from "@tanstack/react-query";
import { ProjectContractorsApi } from "@/services/api/projects/project-contractors";
import type {
  ContractorRepresentative,
  ProjectNotificationContractor,
} from "@/services/api/projects/notifications/types/response";

export const PROJECT_NOTIFICATION_CONTRACTORS_QUERY_KEY =
  "project-notification-contractors" as const;

export function useProjectNotificationContractors(projectId?: string) {
  return useQuery({
    queryKey: [PROJECT_NOTIFICATION_CONTRACTORS_QUERY_KEY, projectId ?? ""],
    queryFn: async () => {
      const res = await ProjectContractorsApi.listForProject(projectId!);
      const payload = res.data?.payload;
      if (!Array.isArray(payload)) return [];
      return payload.map(
        (dto): ProjectNotificationContractor => ({
          id: String(dto.id),
          name: dto.name ?? dto.contractor_name ?? "",
          number: dto.mobile ?? dto.phone ?? "",
          mobile: dto.mobile ?? null,
          notes: null,
          representatives: (dto.representatives ?? []).map(
            (rep): ContractorRepresentative => ({
              id: String(rep.id),
              name: rep.name ?? "",
              mobile: rep.mobile ?? null,
              nationality: rep.nationality ?? null,
            }),
          ),
        }),
      );
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
  });
}
