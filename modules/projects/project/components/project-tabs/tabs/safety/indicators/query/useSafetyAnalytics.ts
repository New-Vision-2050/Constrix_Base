import { useQueries } from "@tanstack/react-query";
import { ProjectSafetyIndicatorsApi } from "@/services/api/projects/project-safety/indicators/api";
import {
  extractListPayload,
  extractSinglePayload,
} from "@/services/api/projects/project-safety/indicators/types";
import {
  mapSafetyAnalyticsCompliant,
  mapSafetyAnalyticsContractorConsultant,
  mapSafetyAnalyticsOverall,
  mapSafetyAnalyticsPerformanceItem,
  mapSafetyAnalyticsViolationItem,
  type SafetyAnalyticsCompliant,
  type SafetyAnalyticsContractorConsultantItem,
  type SafetyAnalyticsOverall,
  type SafetyAnalyticsPerformanceItem,
  type SafetyAnalyticsViolationItem,
} from "./mapSafetyAnalytics";

export const SAFETY_ANALYTICS_QUERY_KEY = "project-safety-analytics" as const;

function analyticsQueryKey(projectId: string, segment: string) {
  return [SAFETY_ANALYTICS_QUERY_KEY, projectId, segment] as const;
}

export function useSafetyAnalytics(projectId: string | undefined) {
  const enabled = !!projectId;

  const results = useQueries({
    queries: [
      {
        queryKey: analyticsQueryKey(projectId!, "overall"),
        queryFn: async (): Promise<SafetyAnalyticsOverall> => {
          const res = await ProjectSafetyIndicatorsApi.getOverall(projectId!);
          return mapSafetyAnalyticsOverall(extractSinglePayload(res.data));
        },
        enabled,
        retry: false,
      },
      {
        queryKey: analyticsQueryKey(projectId!, "compliant"),
        queryFn: async (): Promise<SafetyAnalyticsCompliant> => {
          const res = await ProjectSafetyIndicatorsApi.getCompliant(projectId!);
          return mapSafetyAnalyticsCompliant(extractSinglePayload(res.data));
        },
        enabled,
        retry: false,
      },
      {
        queryKey: analyticsQueryKey(projectId!, "frequent-violations"),
        queryFn: async (): Promise<SafetyAnalyticsViolationItem[]> => {
          const res = await ProjectSafetyIndicatorsApi.getFrequentViolations(
            projectId!,
          );
          return extractListPayload(res.data).map(mapSafetyAnalyticsViolationItem);
        },
        enabled,
        retry: false,
      },
      {
        queryKey: analyticsQueryKey(projectId!, "violation-performance"),
        queryFn: async (): Promise<SafetyAnalyticsPerformanceItem[]> => {
          const res = await ProjectSafetyIndicatorsApi.getViolationPerformance(
            projectId!,
          );
          return extractListPayload(res.data).map(
            mapSafetyAnalyticsPerformanceItem,
          );
        },
        enabled,
        retry: false,
      },
      {
        queryKey: analyticsQueryKey(projectId!, "by-contractor-consultant"),
        queryFn: async (): Promise<SafetyAnalyticsContractorConsultantItem[]> => {
          const res =
            await ProjectSafetyIndicatorsApi.getByContractorConsultant(
              projectId!,
            );
          return extractListPayload(res.data).map(
            mapSafetyAnalyticsContractorConsultant,
          );
        },
        enabled,
        retry: false,
      },
      {
        queryKey: analyticsQueryKey(projectId!, "top-violations"),
        queryFn: async (): Promise<SafetyAnalyticsViolationItem[]> => {
          const res = await ProjectSafetyIndicatorsApi.getTopViolations(
            projectId!,
          );
          return extractListPayload(res.data).map(mapSafetyAnalyticsViolationItem);
        },
        enabled,
        retry: false,
      },
    ],
  });

  const [
    overallQuery,
    compliantQuery,
    frequentViolationsQuery,
    violationPerformanceQuery,
    contractorConsultantQuery,
    topViolationsQuery,
  ] = results;

  return {
    overall: overallQuery.data,
    compliant: compliantQuery.data,
    frequentViolations: frequentViolationsQuery.data ?? [],
    violationPerformance: violationPerformanceQuery.data ?? [],
    contractorConsultant: contractorConsultantQuery.data ?? [],
    topViolations: topViolationsQuery.data ?? [],
    isLoading: results.some((query) => query.isLoading),
    isError: results.some((query) => query.isError),
  };
}
