import { baseApi } from "@/config/axios/instances/base";
import type {
  SafetyAnalyticsByContractorConsultantResponse,
  SafetyAnalyticsCompliantResponse,
  SafetyAnalyticsFrequentViolationsResponse,
  SafetyAnalyticsOverallResponse,
  SafetyAnalyticsTopViolationsResponse,
  SafetyAnalyticsViolationPerformanceResponse,
} from "./types";

export const ProjectSafetyIndicatorsApi = {
  getOverall: (projectId: string | number) =>
    baseApi.get<SafetyAnalyticsOverallResponse>(
      `projects/${projectId}/safety/analytics/overall`,
    ),

  getCompliant: (projectId: string | number) =>
    baseApi.get<SafetyAnalyticsCompliantResponse>(
      `projects/${projectId}/safety/analytics/compliant`,
    ),

  getFrequentViolations: (projectId: string | number) =>
    baseApi.get<SafetyAnalyticsFrequentViolationsResponse>(
      `projects/${projectId}/safety/analytics/frequent-violations`,
    ),

  getViolationPerformance: (projectId: string | number) =>
    baseApi.get<SafetyAnalyticsViolationPerformanceResponse>(
      `projects/${projectId}/safety/analytics/violation-performance`,
    ),

  getByContractorConsultant: (projectId: string | number) =>
    baseApi.get<SafetyAnalyticsByContractorConsultantResponse>(
      `projects/${projectId}/safety/analytics/by-contractor-consultant`,
    ),

  getTopViolations: (projectId: string | number) =>
    baseApi.get<SafetyAnalyticsTopViolationsResponse>(
      `projects/${projectId}/safety/analytics/top-violations`,
    ),
};
