import type { CreatedAttendanceReport } from "@/services/api/hr-reports/attendance";
import { createInitialReportWizardPayload } from "../components/report-wizard/initial-payload";
import type {
  ReportWizardPayload,
  ReportWizardStep1,
  ReportTypeId,
} from "../components/report-wizard/types";
import { STEP2_FILTER_UNSET } from "../components/report-wizard/constants-step2";
import { REPORT_TYPE_OPTIONS } from "../components/report-wizard/constants";
import { normalizeStep3EnumFields } from "./step3-enums";

function mergeStep<T extends object>(base: T, patch: unknown): T {
  if (!patch || typeof patch !== "object") return base;
  return { ...base, ...(patch as Partial<T>) };
}

function normalizeStep1Inbound(
  base: ReportWizardStep1,
  patch: unknown,
): ReportWizardStep1 {
  const merged = mergeStep(base, patch);
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
  return {
    ...merged,
    reportTypeIds,
  };
}

function normalizeStep3Inbound(
  base: ReportWizardPayload["step3"],
  patch: unknown,
): ReportWizardPayload["step3"] {
  const merged = mergeStep(base, patch);
  return normalizeStep3EnumFields({
    ...merged,
    attendanceDataTypeIds: [...merged.attendanceDataTypeIds],
  });
}

function coerceStep2OptionalString(raw: unknown): string {
  if (raw === null || raw === undefined || raw === "") return STEP2_FILTER_UNSET;
  const s = String(raw).trim();
  return s === "" ? STEP2_FILTER_UNSET : s;
}

function normalizeStep2Inbound(
  base: ReportWizardPayload["step2"],
  patch: unknown,
): ReportWizardPayload["step2"] {
  const merged = mergeStep(base, patch);
  return {
    ...merged,
    location: coerceStep2OptionalString(merged.location),
    management: coerceStep2OptionalString(merged.management),
    department: coerceStep2OptionalString(merged.department),
    jobTitle: coerceStep2OptionalString(merged.jobTitle),
    nationality: coerceStep2OptionalString(merged.nationality),
  };
}

/** Merge API `config` into wizard defaults so the summary helpers stay usable. */
export function configToPayload(config: unknown): ReportWizardPayload {
  const base = createInitialReportWizardPayload();
  if (!config || typeof config !== "object") return base;
  const c = config as Record<string, unknown>;
  return {
    step1: normalizeStep1Inbound(base.step1, c.step1),
    step2: normalizeStep2Inbound(base.step2, c.step2),
    step3: normalizeStep3Inbound(base.step3, c.step3),
    step4: mergeStep(base.step4, c.step4),
    step5: mergeStep(base.step5, c.step5),
  };
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
  const bilingualFrom = (raw: unknown): { ar?: string; en?: string } | undefined => {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;
    const n = raw as Record<string, unknown>;
    const ar = typeof n.ar === "string" ? n.ar : undefined;
    const en = typeof n.en === "string" ? n.en : undefined;
    if (ar == null && en == null) return undefined;
    return { ar, en };
  };

  const merged =
    bilingualFrom(row.name) ??
    bilingualFrom(row.title) ??
    bilingualFrom(row.template_name);
  if (merged) return merged;

  const plain =
    (typeof row.name === "string" && row.name.trim() !== ""
      ? row.name.trim()
      : null) ??
    (typeof row.title === "string" && row.title.trim() !== ""
      ? row.title.trim()
      : null) ??
    (typeof row.template_name === "string" && row.template_name.trim() !== ""
      ? row.template_name.trim()
      : null);

  if (plain) return { ar: plain, en: plain };

  return undefined;
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

  const configRaw = parseConfigValue(
    r.config ?? r.settings ?? r.report_config ?? r.configuration,
  );
  const payload = configToPayload(configRaw);
  const apiName = extractApiName(r);

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
  const meta =
    root.meta && typeof root.meta === "object"
      ? (root.meta as Record<string, unknown>)
      : undefined;
  if (typeof meta?.total === "number") total = meta.total;
  if (total == null && typeof root.total === "number") total = root.total;
  if (
    total == null &&
    root.pagination &&
    typeof root.pagination === "object" &&
    typeof (root.pagination as Record<string, unknown>).total === "number"
  ) {
    total = (root.pagination as Record<string, unknown>).total as number;
  }
  if (
    total == null &&
    root.payload &&
    typeof root.payload === "object" &&
    !Array.isArray(root.payload)
  ) {
    const p = root.payload as Record<string, unknown>;
    if (typeof p.total === "number") total = p.total;
  }
  if (
    total == null &&
    root.data &&
    typeof root.data === "object" &&
    !Array.isArray(root.data)
  ) {
    const inner = root.data as Record<string, unknown>;
    if (typeof inner.total === "number") total = inner.total;
    const innerMeta =
      inner.meta && typeof inner.meta === "object"
        ? (inner.meta as Record<string, unknown>)
        : undefined;
    if (typeof innerMeta?.total === "number") total = innerMeta.total;
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
