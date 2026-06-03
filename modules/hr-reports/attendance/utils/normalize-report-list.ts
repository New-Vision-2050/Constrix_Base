import type { CreatedAttendanceReport } from "@/services/api/hr-reports/attendance";
import { createInitialReportWizardPayload } from "../components/report-wizard/initial-payload";
import type {
  EmployeeScopeMode,
  ReportWizardPayload,
  ReportWizardStep1,
  ReportTypeId,
} from "../components/report-wizard/types";
import {
  STEP2_FILTER_UNSET,
  STEP2_JOB_TITLE_VALUES,
  STEP2_LOCATION_VALUES,
  STEP2_MANAGEMENT_VALUES,
} from "../components/report-wizard/constants-step2";
import { REPORT_TYPE_OPTIONS } from "../components/report-wizard/constants-step1";
import { derivedDateRangeFromLegacyStep1 } from "../components/report-wizard/step1-date-range";
import {
  extractDateRangeFromReportName,
  extractDateRangeFromTexts,
} from "./period-display";
import { normalizeStep3EnumFields } from "./step3-enums";

function mergeStep<T extends object>(base: T, patch: unknown): T {
  if (!patch || typeof patch !== "object") return base;
  return { ...base, ...(patch as Partial<T>) };
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return v != null && typeof v === "object" && !Array.isArray(v);
}

/** Map API snake_case step1 fields onto wizard camelCase before merge. */
function coerceStep1Patch(patch: unknown): Record<string, unknown> | undefined {
  if (!isRecord(patch)) return undefined;
  const p = patch;
  return {
    ...p,
    reportTypeIds: p.reportTypeIds ?? p.report_type_ids,
    periodType: p.periodType ?? p.period_type,
    dateFrom: p.dateFrom ?? p.date_from,
    dateTo: p.dateTo ?? p.date_to,
    exportFormat: p.exportFormat ?? p.export_format,
    reportLanguage: p.reportLanguage ?? p.report_language,
    paperSize: p.paperSize ?? p.paper_size,
    printOrientation: p.printOrientation ?? p.print_orientation,
  };
}

function resolveStep1Patch(config: Record<string, unknown>): unknown {
  if (config.step1 != null) return config.step1;
  if (
    config.period_type != null ||
    config.periodType != null ||
    config.date_from != null ||
    config.dateFrom != null
  ) {
    return config;
  }
  return undefined;
}

function parseNameField(raw: unknown): { ar?: string; en?: string } | undefined {
  if (raw == null) return undefined;
  if (typeof raw === "string") {
    const t = raw.trim();
    if (t === "") return undefined;
    if (t.startsWith("{")) {
      try {
        return parseNameField(JSON.parse(t) as unknown);
      } catch {
        return { ar: t, en: t };
      }
    }
    return { ar: t, en: t };
  }
  if (!isRecord(raw)) return undefined;
  const ar = typeof raw.ar === "string" ? raw.ar : undefined;
  const en = typeof raw.en === "string" ? raw.en : undefined;
  if (ar == null && en == null) return undefined;
  return { ar, en };
}

function applyApiNamePeriodToPayload(
  payload: ReportWizardPayload,
  apiName?: { ar?: string; en?: string },
): ReportWizardPayload {
  if (payload.step1.periodType !== "range") return payload;

  const fromName = extractDateRangeFromReportName(apiName);
  if (!fromName) return payload;

  const { step1 } = payload;
  if (
    step1.dateFrom === fromName.dateFrom &&
    step1.dateTo === fromName.dateTo
  ) {
    return payload;
  }

  const y = Number.parseInt(fromName.dateFrom.slice(0, 4), 10);
  const mo = Number.parseInt(fromName.dateFrom.slice(5, 7), 10);
  return {
    ...payload,
    step1: {
      ...step1,
      periodType: "range",
      dateFrom: fromName.dateFrom,
      dateTo: fromName.dateTo,
      year: y,
      month: mo,
      week: null,
      quarter: null,
    },
  };
}

function normalizeStep1Inbound(
  base: ReportWizardStep1,
  patch: unknown,
): ReportWizardStep1 {
  const merged = mergeStep(base, coerceStep1Patch(patch));
  const LEGACY_REPORT_TYPE_ID: Record<string, ReportTypeId> = {
    leave: "leaves",
    payroll: "salaries",
    delays: "lateness",
    branch_comparison: "branches_comparison",
  };
  const ALLOWED = new Set(
    REPORT_TYPE_OPTIONS.map((o) => o.id as ReportTypeId),
  );
  const reportTypeIds = merged.reportTypeIds
    .map((id) => LEGACY_REPORT_TYPE_ID[id] ?? id)
    .filter((id): id is ReportTypeId => ALLOWED.has(id as ReportTypeId));

  const periodType = merged.periodType ?? "range";
  const ranged = derivedDateRangeFromLegacyStep1({
    ...merged,
    periodType,
  });
  const y = Number.parseInt(ranged.dateFrom.slice(0, 4), 10);
  const mo = Number.parseInt(ranged.dateFrom.slice(5, 7), 10);

  return {
    ...merged,
    reportTypeIds,
    periodType,
    dateFrom: ranged.dateFrom,
    dateTo: ranged.dateTo,
    year: periodType === "range" ? y : merged.year,
    month: periodType === "range" ? mo : merged.month,
    week: merged.week ?? null,
    quarter: merged.quarter ?? null,
  };
}

function normalizeStep3Inbound(
  base: ReportWizardPayload["step3"],
  patch: unknown,
): ReportWizardPayload["step3"] {
  const merged = mergeStep(base, patch);
  return normalizeStep3EnumFields(
    merged as Partial<ReportWizardPayload["step3"]> & Record<string, unknown>,
  );
}

function coerceStep2OptionalString(raw: unknown): string {
  if (raw === null || raw === undefined || raw === "") return STEP2_FILTER_UNSET;
  const s = String(raw).trim();
  return s === "" ? STEP2_FILTER_UNSET : s;
}

const LEGACY_BRANCH_SLUGS = new Set<string>(STEP2_LOCATION_VALUES);
const LEGACY_MANAGEMENT_SLUGS = new Set<string>(STEP2_MANAGEMENT_VALUES);
const LEGACY_JOB_TITLE_SLUGS = new Set<string>(STEP2_JOB_TITLE_VALUES);

function downgradeLegacySlug(
  slug: string,
  legacySlugs: Set<string>,
): string {
  if (slug !== STEP2_FILTER_UNSET && legacySlugs.has(slug)) {
    return STEP2_FILTER_UNSET;
  }
  return slug;
}

function normalizeStep2Inbound(
  base: ReportWizardPayload["step2"],
  patch: unknown,
): ReportWizardPayload["step2"] {
  type M = ReportWizardPayload["step2"] & {
    location?: string;
    management?: string;
    jobTitle?: string;
    employeeStatus?: string;
    branch_id?: string;
    management_id?: string;
    job_title?: string;
    employee_user_ids?: unknown;
  };
  const merged = mergeStep(base, patch) as M;

  const branchId = downgradeLegacySlug(
    coerceStep2OptionalString(
      merged.branchId ?? merged.branch_id ?? merged.location,
    ),
    LEGACY_BRANCH_SLUGS,
  );

  const managementId = downgradeLegacySlug(
    coerceStep2OptionalString(
      merged.managementId ??
        merged.management_id ??
        merged.management,
    ),
    LEGACY_MANAGEMENT_SLUGS,
  );

  const jobTitleId = downgradeLegacySlug(
    coerceStep2OptionalString(
      merged.jobTitleId ?? merged.job_title ?? merged.jobTitle,
    ),
    LEGACY_JOB_TITLE_SLUGS,
  );

  let employeeScope: EmployeeScopeMode = "all";
  if (merged.employeeScope === "select_employees") {
    employeeScope = "select_employees";
  } else if (merged.employeeScope === "all") {
    employeeScope = "all";
  } else if (
    typeof merged.employeeStatus === "string" &&
    merged.employeeStatus !== "all"
  ) {
    employeeScope = "select_employees";
  }

  const rawIds = merged.employeeUserIds ?? merged.employee_user_ids;
  const employeeUserIds = Array.isArray(rawIds)
    ? rawIds.map((x) => String(x))
    : [];

  const gender =
    typeof merged.gender === "string" && merged.gender.trim() !== ""
      ? merged.gender
      : "all";

  return {
    employeeScope,
    employeeUserIds,
    branchId,
    managementId,
    jobTitleId,
    department: coerceStep2OptionalString(merged.department),
    nationality: coerceStep2OptionalString(merged.nationality),
    gender,
    contractTypeIds: [...merged.contractTypeIds],
    branchName:
      typeof merged.branchName === "string" ? merged.branchName : undefined,
    managementName:
      typeof merged.managementName === "string"
        ? merged.managementName
        : undefined,
    jobTitleName:
      typeof merged.jobTitleName === "string" ? merged.jobTitleName : undefined,
  };
}

/** Merge API `config` into wizard defaults so the summary helpers stay usable. */
export function configToPayload(
  config: unknown,
  apiName?: { ar?: string; en?: string },
): ReportWizardPayload {
  const base = createInitialReportWizardPayload();
  if (!config || typeof config !== "object") {
    return applyApiNamePeriodToPayload(base, apiName);
  }
  const c = config as Record<string, unknown>;
  const payload: ReportWizardPayload = {
    step1: normalizeStep1Inbound(base.step1, resolveStep1Patch(c)),
    step2: normalizeStep2Inbound(base.step2, c.step2),
    step3: normalizeStep3Inbound(base.step3, c.step3),
  };
  return applyApiNamePeriodToPayload(payload, apiName);
}

function parseConfigValue(raw: unknown): unknown {
  if (raw == null) return undefined;
  if (typeof raw === "string") {
    const t = raw.trim();
    if (t === "") return undefined;
    try {
      return JSON.parse(t) as unknown;
    } catch {
      return undefined;
    }
  }
  return raw;
}

function extractApiName(row: Record<string, unknown>): {
  ar?: string;
  en?: string;
} | undefined {
  const merged =
    parseNameField(row.name) ??
    parseNameField(row.title) ??
    parseNameField(row.template_name) ??
    parseNameField(row.report_name);
  if (merged) return merged;

  const ar =
    typeof row.name_ar === "string"
      ? row.name_ar
      : typeof row.title_ar === "string"
        ? row.title_ar
        : undefined;
  const en =
    typeof row.name_en === "string"
      ? row.name_en
      : typeof row.title_en === "string"
        ? row.title_en
        : undefined;
  if (ar != null || en != null) return { ar, en };

  return undefined;
}

function extractRowPeriodHint(
  row: Record<string, unknown>,
): { dateFrom: string; dateTo: string } | undefined {
  const from =
    row.date_from ??
    row.dateFrom ??
    row.period_from ??
    row.period_start ??
    row.start_date;
  const to =
    row.date_to ??
    row.dateTo ??
    row.period_to ??
    row.period_end ??
    row.end_date;
  if (typeof from !== "string" || typeof to !== "string") return undefined;
  const range = extractDateRangeFromTexts(from, to);
  return range ?? undefined;
}

export function normalizeReportListItem(
  row: unknown,
): CreatedAttendanceReport | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  const id =
    r.id != null
      ? String(r.id)
      : r.uuid != null
        ? String(r.uuid)
        : r.report_id != null
          ? String(r.report_id)
          : r.template_id != null
            ? String(r.template_id)
            : undefined;
  if (!id) return null;

  const createdRaw =
    r.created_at ?? r.createdAt ?? r.updated_at ?? r.created_at_iso;
  let createdAt: string;
  if (typeof createdRaw === "string") {
    createdAt = createdRaw;
  } else if (createdRaw instanceof Date) {
    createdAt = createdRaw.toISOString();
  } else {
    createdAt = new Date().toISOString();
  }

  const apiName = extractApiName(r);
  const rowPeriod = extractRowPeriodHint(r);
  const configRaw = parseConfigValue(
    r.config ?? r.settings ?? r.report_config ?? r.configuration,
  );
  let payload = configToPayload(configRaw, apiName);
  if (rowPeriod && payload.step1.periodType === "range") {
    const y = Number.parseInt(rowPeriod.dateFrom.slice(0, 4), 10);
    const mo = Number.parseInt(rowPeriod.dateFrom.slice(5, 7), 10);
    payload = {
      ...payload,
      step1: {
        ...payload.step1,
        dateFrom: rowPeriod.dateFrom,
        dateTo: rowPeriod.dateTo,
        year: y,
        month: mo,
      },
    };
  }

  return { id, createdAt, payload, apiName };
}

/** Unwraps typical `{ data }`, `{ payload }`, etc. from GET `/reports/:id`. */
export function parseReportDetailResponse(data: unknown): CreatedAttendanceReport | null {
  const direct = normalizeReportListItem(data);
  if (direct) return direct;
  if (!data || typeof data !== "object") return null;
  const root = data as Record<string, unknown>;
  const unwrapCandidates: unknown[] = [
    root.data,
    root.payload,
    root.result,
    root.report,
  ];
  for (const c of unwrapCandidates) {
    if (!c || typeof c !== "object" || Array.isArray(c)) continue;
    const inner = c as Record<string, unknown>;
    const one = normalizeReportListItem(inner);
    if (one) return one;
    const nested = inner.data;
    if (nested && typeof nested === "object" && !Array.isArray(nested)) {
      const two = normalizeReportListItem(nested);
      if (two) return two;
    }
  }
  return null;
}

export type ParsedReportsList = {
  items: CreatedAttendanceReport[];
  total: number;
};

function extractRowsAndTotal(data: unknown): {
  rows: unknown[];
  total: number;
} {
  if (Array.isArray(data)) {
    return { rows: data, total: data.length };
  }
  if (!data || typeof data !== "object") {
    return { rows: [], total: 0 };
  }

  const root = data as Record<string, unknown>;

  let rows: unknown[] = [];

  const assignIfArray = (v: unknown) => {
    if (Array.isArray(v)) rows = v;
  };

  assignIfArray(root.data);
  if (rows.length === 0 && root.data && typeof root.data === "object") {
    const inner = root.data as Record<string, unknown>;
    assignIfArray(inner.data);
    if (rows.length === 0) assignIfArray(inner.records);
    if (rows.length === 0) assignIfArray(inner.reports);
  }
  if (rows.length === 0) assignIfArray(root.payload);
  if (rows.length === 0 && root.payload && typeof root.payload === "object") {
    const p = root.payload as Record<string, unknown>;
    assignIfArray(p.data);
    if (rows.length === 0) assignIfArray(p.records);
    if (rows.length === 0) assignIfArray(p.reports);
  }
  if (rows.length === 0) assignIfArray(root.items);
  if (rows.length === 0) assignIfArray(root.reports);
  if (rows.length === 0) assignIfArray(root.result);

  let total: number | undefined;
  const readTotalFromObject = (obj: Record<string, unknown>) => {
    for (const key of ["total", "result_count", "total_count"] as const) {
      const v = obj[key];
      if (typeof v === "number" && Number.isFinite(v)) return v;
    }
    return undefined;
  };

  const meta =
    root.meta && typeof root.meta === "object"
      ? (root.meta as Record<string, unknown>)
      : undefined;
  if (meta) {
    const fromMeta = readTotalFromObject(meta);
    if (fromMeta != null) total = fromMeta;
  }
  if (total == null) {
    const fromRoot = readTotalFromObject(root);
    if (fromRoot != null) total = fromRoot;
  }
  if (total == null && root.pagination && typeof root.pagination === "object") {
    const fromPag = readTotalFromObject(
      root.pagination as Record<string, unknown>,
    );
    if (fromPag != null) total = fromPag;
  }
  if (
    total == null &&
    root.payload &&
    typeof root.payload === "object" &&
    !Array.isArray(root.payload)
  ) {
    const fromP = readTotalFromObject(root.payload as Record<string, unknown>);
    if (fromP != null) total = fromP;
  }
  if (
    total == null &&
    root.data &&
    typeof root.data === "object" &&
    !Array.isArray(root.data)
  ) {
    const inner = root.data as Record<string, unknown>;
    const fromInner = readTotalFromObject(inner);
    if (fromInner != null) total = fromInner;
    const innerMeta =
      inner.meta && typeof inner.meta === "object"
        ? (inner.meta as Record<string, unknown>)
        : undefined;
    if (total == null && innerMeta) {
      const fromInnerMeta = readTotalFromObject(innerMeta);
      if (fromInnerMeta != null) total = fromInnerMeta;
    }
    if (total == null && inner.pagination && typeof inner.pagination === "object") {
      const fromInnerPag = readTotalFromObject(
        inner.pagination as Record<string, unknown>,
      );
      if (fromInnerPag != null) total = fromInnerPag;
    }
  }

  return { rows, total: total ?? rows.length };
}

/** Supports Laravel pagination, nested `data`, `payload` / `items` lists, and raw arrays. */
export function parseListReportsResponse(data: unknown): ParsedReportsList {
  const { rows, total } = extractRowsAndTotal(data);
  const items: CreatedAttendanceReport[] = [];
  for (const row of rows) {
    const normalized = normalizeReportListItem(row);
    if (normalized) items.push(normalized);
  }
  return { items, total };
}
