import { baseApi } from "@/config/axios/instances/base";
import {
  buildListProjectSafetyVisitsParams,
  buildListProjectSafetyWeeklyReportsParams,
  type ListProjectSafetyVisitsParams,
  type ListProjectSafetyWeeklyReportsParams,
} from "./types/params";
import type {
  ListProjectSafetyReportsResponse,
  ListProjectSafetyVisitsResponse,
  ListProjectSafetyWeeklyReportsResponse,
  SafetyAnalyticsByContractorConsultantResponse,
  SafetyAnalyticsCompliantResponse,
  SafetyAnalyticsFrequentViolationsResponse,
  SafetyAnalyticsOverallResponse,
  SafetyAnalyticsTopViolationsResponse,
  SafetyAnalyticsViolationPerformanceResponse,
} from "./types/response";

export const ProjectSafetyApi = {
  getViolationReport: (
    projectId: string | number,
    safetyId: string | number,
  ) =>
    baseApi.get<Blob>(
      `projects/${projectId}/safety/${safetyId}/violation-report`,
      { responseType: "blob" },
    ),

  getViolationFormReport: (
    projectId: string | number,
    safetyId: string | number,
  ) =>
    baseApi.get<Blob>(
      `projects/${projectId}/safety/${safetyId}/violation-form-report`,
      { responseType: "blob" },
    ),

  listVisitsForProject: (
    projectId: string | number,
    params?: ListProjectSafetyVisitsParams,
  ) =>
    baseApi.get<ListProjectSafetyVisitsResponse>(
      `projects/${projectId}/safety`,
      {
        params: buildListProjectSafetyVisitsParams(params ?? {}),
      },
    ),

  listReportsForProject: (projectId: string | number) =>
    baseApi.get<ListProjectSafetyReportsResponse>(
      `projects/${projectId}/safety/report`,
    ),

  getAnalyticsOverall: (projectId: string | number) =>
    baseApi.get<SafetyAnalyticsOverallResponse>(
      `projects/${projectId}/safety/analytics/overall`,
    ),

  getAnalyticsCompliant: (projectId: string | number) =>
    baseApi.get<SafetyAnalyticsCompliantResponse>(
      `projects/${projectId}/safety/analytics/compliant`,
    ),

  getAnalyticsFrequentViolations: (projectId: string | number) =>
    baseApi.get<SafetyAnalyticsFrequentViolationsResponse>(
      `projects/${projectId}/safety/analytics/frequent-violations`,
    ),

  getAnalyticsViolationPerformance: (projectId: string | number) =>
    baseApi.get<SafetyAnalyticsViolationPerformanceResponse>(
      `projects/${projectId}/safety/analytics/violation-performance`,
    ),

  getAnalyticsByContractorConsultant: (projectId: string | number) =>
    baseApi.get<SafetyAnalyticsByContractorConsultantResponse>(
      `projects/${projectId}/safety/analytics/by-contractor-consultant`,
    ),

  getAnalyticsTopViolations: () =>
    baseApi.get<SafetyAnalyticsTopViolationsResponse>(
      `projects/safety/analytics/top-violations`,
    ),

  /** List generated weekly reports. */
  listWeeklyReportsForProject: (
    projectId: string | number,
    params?: ListProjectSafetyWeeklyReportsParams,
  ) =>
    baseApi.get<ListProjectSafetyWeeklyReportsResponse>(
      `projects/${projectId}/safety/weekly-reports`,
      {
        params: buildListProjectSafetyWeeklyReportsParams(params ?? {}),
      },
    ),

  /** Generate a weekly report for a date range. */
  createWeeklyReportForProject: (
    projectId: string | number,
    params: Required<ListProjectSafetyWeeklyReportsParams>,
  ) =>
    baseApi.post<ListProjectSafetyWeeklyReportsResponse>(
      `projects/${projectId}/safety/weekly-report`,
      {
        from_date: params.from_date,
        to_date: params.to_date,
      },
    ),
};

export const ProjectSafetyVisitsApi = {
  listForProject: ProjectSafetyApi.listVisitsForProject,
};

export const ProjectSafetyReportsApi = {
  listForProject: ProjectSafetyApi.listReportsForProject,
};

export const ProjectSafetyIndicatorsApi = {
  getOverall: ProjectSafetyApi.getAnalyticsOverall,
  getCompliant: ProjectSafetyApi.getAnalyticsCompliant,
  getFrequentViolations: ProjectSafetyApi.getAnalyticsFrequentViolations,
  getViolationPerformance: ProjectSafetyApi.getAnalyticsViolationPerformance,
  getByContractorConsultant: ProjectSafetyApi.getAnalyticsByContractorConsultant,
  getTopViolations: ProjectSafetyApi.getAnalyticsTopViolations,
};

export const ProjectSafetyWeeklyReportsApi = {
  listForProject: ProjectSafetyApi.listWeeklyReportsForProject,
  createForProject: ProjectSafetyApi.createWeeklyReportForProject,
};
