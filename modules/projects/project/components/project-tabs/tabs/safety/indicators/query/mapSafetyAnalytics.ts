import { getRatingBand, type ChartSliceItem } from "../utils/safetyIndicatorUtils";
import type {
  SafetyAnalyticsContractorConsultantDto,
  SafetyAnalyticsCompliantDto,
  SafetyAnalyticsOverallDto,
  SafetyAnalyticsViolationItemDto,
  SafetyAnalyticsViolationPerformanceDto,
} from "@/services/api/projects/project-safety/types/response";

function toNumber(value: unknown): number {
  if (value === null || value === undefined || value === "") return 0;
  const num = Number(value);
  return Number.isNaN(num) ? 0 : num;
}

function pickString(...values: Array<string | null | undefined>): string {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return "";
}

export type SafetyAnalyticsOverall = {
  averagePercentage: number;
  totalEvaluations: number;
  completedEvaluations: number;
  pendingEvaluations: number;
};

export type SafetyAnalyticsCompliant = {
  projectId: string;
  compliantLocations: number;
  totalLocations: number;
  isProjectCompliant: boolean;
};

export type SafetyAnalyticsViolationItem = {
  id: string;
  code: string;
  description: string;
  category: string;
  defaultWeight: number;
  count: number;
};

export type SafetyAnalyticsPerformanceItem = {
  id: string;
  code: string;
  description: string;
  category: string;
  totalEvaluations: number;
  violationFoundCount: number;
  noViolationCount: number;
  notApplicableCount: number;
  complianceRate: number;
  band: ReturnType<typeof getRatingBand>;
};

export type SafetyAnalyticsContractorConsultantItem = {
  contractorId: string;
  contractorName: string;
  consultant: string;
  consultantEngineer: string;
  violationCount: number;
};

export function mapSafetyAnalyticsOverall(
  dto: SafetyAnalyticsOverallDto | null,
): SafetyAnalyticsOverall {
  return {
    averagePercentage: Math.round(toNumber(dto?.average_percentage)),
    totalEvaluations: toNumber(dto?.total_evaluations),
    completedEvaluations: toNumber(dto?.completed_evaluations),
    pendingEvaluations: toNumber(dto?.pending_evaluations),
  };
}

export function mapSafetyAnalyticsCompliant(
  dto: SafetyAnalyticsCompliantDto | null,
): SafetyAnalyticsCompliant {
  return {
    projectId: pickString(dto?.project_id),
    compliantLocations: toNumber(dto?.compliant_locations),
    totalLocations: toNumber(dto?.total_locations),
    isProjectCompliant: dto?.is_project_compliant === true,
  };
}

export function mapSafetyAnalyticsViolationItem(
  dto: SafetyAnalyticsViolationItemDto,
): SafetyAnalyticsViolationItem {
  return {
    id: pickString(dto.id),
    code: pickString(dto.code),
    description: pickString(dto.description, dto.code),
    category: pickString(dto.category),
    defaultWeight: toNumber(dto.default_weight),
    count: toNumber(dto.count),
  };
}

export function mapSafetyAnalyticsPerformanceItem(
  dto: SafetyAnalyticsViolationPerformanceDto,
): SafetyAnalyticsPerformanceItem {
  const complianceRate = toNumber(dto.compliance_rate);
  return {
    id: pickString(dto.id),
    code: pickString(dto.code),
    description: pickString(dto.description, dto.code),
    category: pickString(dto.category),
    totalEvaluations: toNumber(dto.total_evaluations),
    violationFoundCount: toNumber(dto.violation_found_count),
    noViolationCount: toNumber(dto.no_violation_count),
    notApplicableCount: toNumber(dto.not_applicable_count),
    complianceRate,
    band: getRatingBand(complianceRate),
  };
}

export function mapSafetyAnalyticsContractorConsultant(
  dto: SafetyAnalyticsContractorConsultantDto,
): SafetyAnalyticsContractorConsultantItem {
  return {
    contractorId: pickString(dto.contractor_id),
    contractorName: pickString(dto.contractor_name),
    consultant: pickString(dto.consultant),
    consultantEngineer: pickString(dto.consultant_engineer),
    violationCount: toNumber(dto.violation_count),
  };
}

export function buildContractorConsultantLabel(
  item: SafetyAnalyticsContractorConsultantItem,
  fallbackLabel: string,
): string {
  const parts = [item.contractorName, item.consultant].filter(Boolean);
  return parts.length ? parts.join(" — ") : fallbackLabel;
}

export function toChartSlices(
  items: Array<{ label: string; value: number; code?: string }>,
): ChartSliceItem[] {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  return items.map((item) => ({
    label: item.label,
    value: item.value,
    code: item.code,
    percentage: total > 0 ? Math.round((item.value / total) * 1000) / 10 : 0,
  }));
}
