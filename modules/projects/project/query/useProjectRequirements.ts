import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProjectRequirementsApi } from "@/services/api/projects/project-requirements";
import type {
  CreateProjectRequirementArgs,
  CreateProjectRequirementsArgs,
} from "@/services/api/projects/project-requirements/types/params";
import type { ProjectRequirementDto } from "@/services/api/projects/project-requirements/types/response";
import type {
  DocumentRequirementRow,
  DocumentRequirementStat,
} from "@/modules/projects/project/components/project-tabs/tabs/document-requirements/types";
import { mapProjectRequirementDto } from "./mapProjectRequirement";
import { mapRequirementsSummaryToStats } from "./mapRequirementsSummary";

export const PROJECT_REQUIREMENTS_QUERY_KEY = "project-requirements" as const;

export const projectRequirementsQueryKey = (
  projectId: string,
  page: number,
  perPage: number,
  search?: string,
) =>
  [
    PROJECT_REQUIREMENTS_QUERY_KEY,
    projectId,
    page,
    perPage,
    search ?? "",
  ] as const;

function listFromBody(body: {
  payload?: ProjectRequirementDto[];
  data?: ProjectRequirementDto[];
}): ProjectRequirementDto[] {
  const raw = body.payload ?? body.data;
  return Array.isArray(raw) ? raw : [];
}

export interface UseProjectRequirementsParams {
  projectId?: string;
  page: number;
  perPage: number;
  search?: string;
}

export interface ProjectRequirementsResult {
  data: DocumentRequirementRow[];
  totalPages: number;
  totalItems: number;
  stats: DocumentRequirementStat[];
}

export function useProjectRequirements(params: UseProjectRequirementsParams) {
  const { projectId, page, perPage, search } = params;
  const trimmedSearch = search?.trim() || undefined;

  return useQuery({
    queryKey: projectId
      ? projectRequirementsQueryKey(projectId, page, perPage, trimmedSearch)
      : [PROJECT_REQUIREMENTS_QUERY_KEY],
    queryFn: async (): Promise<ProjectRequirementsResult> => {
      const res = await ProjectRequirementsApi.listForProject(projectId!, {
        page,
        per_page: perPage,
        ...(trimmedSearch ? { search: trimmedSearch } : {}),
      });
      const body = res.data;
      const rows = listFromBody(body);

      return {
        data: rows.map(mapProjectRequirementDto),
        totalPages: body.last_page ?? body.pagination?.last_page ?? 1,
        totalItems:
          body.total ?? body.pagination?.result_count ?? rows.length,
        stats: mapRequirementsSummaryToStats(body.summary),
      };
    },
    enabled: !!projectId,
    placeholderData: (prev) => prev,
    retry: false,
  });
}

export function useCreateProjectRequirements(projectId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      body: CreateProjectRequirementsArgs | CreateProjectRequirementArgs,
    ) => {
      if (!projectId) throw new Error("Missing project ID");
      return ProjectRequirementsApi.createForProject(projectId, body);
    },
    onSuccess: () => {
      if (projectId) {
        queryClient.invalidateQueries({
          queryKey: [PROJECT_REQUIREMENTS_QUERY_KEY, projectId],
        });
      }
    },
  });
}

export function useCreateRequirementSubmission(projectId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      requirementId,
      files,
    }: {
      requirementId: string;
      files: File[];
    }) => {
      if (!projectId) throw new Error("Missing project ID");
      return ProjectRequirementsApi.createSubmission(
        projectId,
        requirementId,
        files,
      );
    },
    onSuccess: (_data, variables) => {
      if (!projectId) return;
      queryClient.invalidateQueries({
        queryKey: [PROJECT_REQUIREMENTS_QUERY_KEY, projectId],
      });
      queryClient.invalidateQueries({
        queryKey: [
          PROJECT_REQUIREMENTS_QUERY_KEY,
          "submissions",
          projectId,
          variables.requirementId,
        ],
      });
    },
  });
}

export function useRequirementSubmissions(
  projectId: string | undefined,
  requirementId: string | undefined,
  enabled = true,
) {
  return useQuery({
    queryKey: [
      PROJECT_REQUIREMENTS_QUERY_KEY,
      "submissions",
      projectId,
      requirementId,
    ],
    queryFn: async () => {
      const res = await ProjectRequirementsApi.listSubmissions(
        projectId!,
        requirementId!,
      );
      const body = res.data;
      const rows = body.payload ?? body.data ?? [];
      return Array.isArray(rows) ? rows : [];
    },
    enabled: !!projectId && !!requirementId && enabled,
    retry: false,
  });
}
