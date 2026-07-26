import { ProjectSafetyVisitsApi } from "./visits/api";
import { ProjectSafetyReportsApi } from "./safety-reports/api";
import { ProjectSafetyIndicatorsApi } from "./indicators/api";

export { ProjectSafetyVisitsApi } from "./visits/api";
export { ProjectSafetyReportsApi } from "./safety-reports/api";
export { ProjectSafetyIndicatorsApi } from "./indicators/api";
export { ProjectSafetyReportsTabApi } from "./reports/api";

export type {
  ProjectSafetyRecordDto,
  ProjectSafetyViolationDto,
} from "./visits/types";
export type { ProjectSafetyReportDto } from "./safety-reports/types";
export type {
  SafetyAnalyticsOverallDto,
  SafetyAnalyticsCompliantDto,
  SafetyAnalyticsViolationItemDto,
  SafetyAnalyticsViolationPerformanceDto,
  SafetyAnalyticsContractorConsultantDto,
} from "./indicators/types";

/** @deprecated Prefer tab-specific APIs (ProjectSafetyVisitsApi, etc.). */
export const ProjectSafetyApi = {
  listForProject: ProjectSafetyVisitsApi.listForProject,
  listReportsForProject: ProjectSafetyReportsApi.listForProject,
  getAnalyticsOverall: ProjectSafetyIndicatorsApi.getOverall,
  getAnalyticsCompliant: ProjectSafetyIndicatorsApi.getCompliant,
  getAnalyticsFrequentViolations: ProjectSafetyIndicatorsApi.getFrequentViolations,
  getAnalyticsViolationPerformance:
    ProjectSafetyIndicatorsApi.getViolationPerformance,
  getAnalyticsByContractorConsultant:
    ProjectSafetyIndicatorsApi.getByContractorConsultant,
  getAnalyticsTopViolations: ProjectSafetyIndicatorsApi.getTopViolations,
};
