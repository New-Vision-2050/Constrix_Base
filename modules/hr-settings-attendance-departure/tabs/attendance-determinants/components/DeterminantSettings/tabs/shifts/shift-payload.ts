import type {
  AssignConstraintShiftsDailyBody,
  AssignConstraintShiftsWeeklyBody,
  ConstraintShiftPeriodItem,
  ConstraintShiftWeekday,
} from "@/services/api/attendance-constraints/types/params";
import { WEEK_DAYS } from "./timing-constants";
import type { DayPeriodRow } from "./timing-types";
import { DEFAULT_DAY_PERIOD_ROW } from "./timing-types";

const WEEK_ID_SET = new Set<string>(WEEK_DAYS.map((d) => d.id));

export function to24HourHm(time: string, meridiem: "AM" | "PM"): string {
  const [hRaw, mRaw = "0"] = time.trim().split(":");
  let h = Number.parseInt(hRaw.trim(), 10);
  const m = Number.parseInt(String(mRaw).trim(), 10);
  if (!Number.isFinite(h) || !Number.isFinite(m)) {
    throw new Error("يرجى التأكد من صحة أوقات الفترات.");
  }
  const min = Math.min(59, Math.max(0, m));

  // `<input type="time">` always uses 24-hour HH:mm. The sibling AM/PM control can drift
  // out of sync (e.g. 18:00 + PM). Hours 13–23 are unambiguously 24h — do not add 12.
  if (h >= 13 && h <= 23) {
    return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
  }

  if (meridiem === "AM") {
    if (h === 12) h = 0;
  } else if (h !== 12) {
    h += 12;
  }
  if (h < 0 || h > 23) {
    throw new Error("يرجى التأكد من صحة أوقات الفترات.");
  }
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

export function sortWeekdaysForApi(days: string[]): ConstraintShiftWeekday[] {
  const rank = new Map(WEEK_DAYS.map((d, i) => [d.id, i] as const));
  return [...new Set(days)]
    .filter((id): id is ConstraintShiftWeekday => WEEK_ID_SET.has(id))
    .sort((a, b) => (rank.get(a) ?? 99) - (rank.get(b) ?? 99));
}

export function buildWeeklyShiftsRequestBody(
  days: string[],
  periodRows: DayPeriodRow[],
): AssignConstraintShiftsWeeklyBody {
  return {
    mode: "weekly",
    days: sortWeekdaysForApi(days),
    periods: periodRows.map((row) => ({
      start_time: to24HourHm(row.from, row.fromMeridiem),
      end_time: to24HourHm(row.to, row.toMeridiem),
      extends_to_next_day: row.endsNextDay,
    })),
  };
}

function dayLabelForApiId(dayId: string): string {
  return WEEK_DAYS.find((d) => d.id === dayId)?.label ?? dayId;
}

export function buildDailyShiftsRequestBody(
  selectedDays: string[],
  dayPeriodRows: Record<string, DayPeriodRow[]>,
): AssignConstraintShiftsDailyBody {
  const sortedDays = sortWeekdaysForApi(selectedDays);
  const schedule: AssignConstraintShiftsDailyBody["schedule"] = {};

  for (const dayId of sortedDays) {
    const rows = dayPeriodRows[dayId] ?? [];
    if (rows.length === 0) {
      throw new Error(
        `يرجى إضافة فترات الدوام ليوم «${dayLabelForApiId(dayId)}».`,
      );
    }
    schedule[dayId] = {
      periods: rows.map((row) => ({
        start_time: to24HourHm(row.from, row.fromMeridiem),
        end_time: to24HourHm(row.to, row.toMeridiem),
        extends_to_next_day: row.endsNextDay,
      })),
    };
  }

  return {
    mode: "daily",
    schedule,
  };
}

export function unwrapShiftsApiError(error: unknown, fallbackMsg: string): Error {
  const data = (
    error as { response?: { data?: { message?: string | string[] } } }
  ).response?.data;
  let msg =
    typeof data?.message === "string"
      ? data.message
      : Array.isArray(data?.message)
        ? data.message.filter(Boolean).join(", ")
        : "";
  msg = msg || fallbackMsg;
  return new Error(msg);
}

function recordUnknown(v: unknown): Record<string, unknown> | undefined {
  if (v !== null && typeof v === "object" && !Array.isArray(v))
    return v as Record<string, unknown>;
  return undefined;
}

/** Pull shift config object from typical list/detail API envelopes. */
export function unwrapConstraintShiftsPayloadNode(
  envelope: unknown,
): unknown {
  if (!envelope || typeof envelope !== "object") return undefined;
  const e = envelope as Record<string, unknown>;
  let inner: unknown =
    e.payload ?? e.data ?? e.shift ?? e.shifts ?? e.result ?? envelope;
  const r1 = recordUnknown(inner);
  if (r1) inner = r1.shifts ?? r1.shift ?? inner;
  return inner;
}

export function hm24ToClockAndMeridiem(hm: string): {
  clock: string;
  meridiem: "AM" | "PM";
} {
  const [hRaw, mRaw = "0"] = hm.trim().split(":");
  const h = Number.parseInt(hRaw.trim(), 10);
  const m = Number.parseInt(String(mRaw).trim(), 10);
  if (!Number.isFinite(h) || !Number.isFinite(m))
    throw new Error("يرجى التأكد من صحة أوقات الفترات.");
  if (h < 0 || h > 23)
    throw new Error("يرجى التأكد من صحة أوقات الفترات.");
  const min = Math.min(59, Math.max(0, m));
  const meridiem: "AM" | "PM" = h >= 12 ? "PM" : "AM";
  return {
    clock: `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`,
    meridiem,
  };
}

function apiPeriodItemToRow(item: ConstraintShiftPeriodItem): DayPeriodRow {
  const s = hm24ToClockAndMeridiem(item.start_time);
  const et = hm24ToClockAndMeridiem(item.end_time);
  return {
    from: s.clock,
    fromMeridiem: s.meridiem,
    to: et.clock,
    toMeridiem: et.meridiem,
    endsNextDay: Boolean(item.extends_to_next_day),
  };
}

function normalizeWeekdayList(raw: unknown): ConstraintShiftWeekday[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((d) => String(d).trim().toLowerCase())
    .filter((id): id is ConstraintShiftWeekday => WEEK_ID_SET.has(id));
}

function coercePeriodList(raw: unknown): ConstraintShiftPeriodItem[] {
  if (!Array.isArray(raw)) return [];
  const out: ConstraintShiftPeriodItem[] = [];
  for (const p of raw) {
    const o = recordUnknown(p);
    if (!o) continue;
    const st = typeof o.start_time === "string" ? o.start_time.trim() : "";
    const et = typeof o.end_time === "string" ? o.end_time.trim() : "";
    if (!st || !et) continue;
    out.push({
      start_time: st,
      end_time: et,
      extends_to_next_day: Boolean(o.extends_to_next_day),
    });
  }
  return out;
}

export function cloneDefaultWeeklyPeriodRows(): DayPeriodRow[] {
  return [{ ...DEFAULT_DAY_PERIOD_ROW, to: "06:00", toMeridiem: "PM" }];
}

function parseDailyScheduleRaw(
  schedule: unknown,
): AssignConstraintShiftsDailyBody["schedule"] | null {
  const d = recordUnknown(schedule);
  if (!d) return null;
  const cleaned: AssignConstraintShiftsDailyBody["schedule"] = {};
  for (const [dayId, block] of Object.entries(d)) {
    if (!WEEK_ID_SET.has(dayId)) continue;
    const nested = recordUnknown(block);
    const periods = coercePeriodList(
      nested?.periods ?? (Array.isArray(block) ? block : null),
    );
    if (periods.length === 0) continue;
    cleaned[dayId as ConstraintShiftWeekday] = { periods };
  }
  return Object.keys(cleaned).length > 0 ? cleaned : null;
}

function parseRawScheduleToDayPeriodRows(
  raw: unknown,
): Record<string, DayPeriodRow[]> {
  const d = recordUnknown(raw);
  if (!d) return {};
  const rows: Record<string, DayPeriodRow[]> = {};
  for (const [key, block] of Object.entries(d)) {
    const dayId = key.trim().toLowerCase();
    if (!WEEK_ID_SET.has(dayId)) continue;
    const rec = recordUnknown(block);
    const periods = coercePeriodList(
      rec?.periods ?? (Array.isArray(block) ? block : null),
    );
    if (periods.length === 0) continue;
    if (rec && rec.enabled === false) continue;
    rows[dayId] = periods.map(apiPeriodItemToRow);
  }
  return rows;
}

function tryParseShiftsBody(
  inner: unknown,
): AssignConstraintShiftsWeeklyBody | AssignConstraintShiftsDailyBody | null {
  const o = recordUnknown(inner);
  if (!o) return null;
  const modeRaw = typeof o.mode === "string" ? o.mode.toLowerCase() : "";

  if (modeRaw === "weekly") {
    const days = normalizeWeekdayList(o.days);
    const periods = coercePeriodList(o.periods);
    if (days.length === 0 || periods.length === 0) return null;
    return { mode: "weekly", days, periods };
  }
  if (modeRaw === "daily") {
    const sched = parseDailyScheduleRaw(o.schedule);
    return sched ? { mode: "daily", schedule: sched } : null;
  }
  const implicit = parseDailyScheduleRaw(o.schedule);
  if (implicit) return { mode: "daily", schedule: implicit };
  return null;
}

function scheduleToDayPeriodRows(
  schedule: AssignConstraintShiftsDailyBody["schedule"],
): Record<string, DayPeriodRow[]> {
  const rows: Record<string, DayPeriodRow[]> = {};
  if (!schedule) return rows;
  for (const dayId of sortWeekdaysForApi(
    Object.keys(schedule) as string[],
  )) {
    const block = schedule[dayId];
    const periods = block?.periods;
    if (!periods?.length) continue;
    rows[dayId] = periods.map(apiPeriodItemToRow);
  }
  return rows;
}

export type HydratedShiftUiState = {
  weeklyDays: string[];
  weeklyPeriodRows: DayPeriodRow[];
  dayPeriodRows: Record<string, DayPeriodRow[]>;
};

export function hydratedShiftStateFromApiEnvelope(
  envelope: unknown,
): HydratedShiftUiState | null {
  const inner = unwrapConstraintShiftsPayloadNode(envelope);
  const root = recordUnknown(inner);

  let dayPeriodRows: Record<string, DayPeriodRow[]> = {};
  if (root) {
    dayPeriodRows = parseRawScheduleToDayPeriodRows(
      root.raw_schedule ?? root.rawSchedule,
    );
  }

  const body = tryParseShiftsBody(inner);

  if (!body) {
    if (Object.keys(dayPeriodRows).length === 0) return null;
    const weeklyDays = sortWeekdaysForApi(Object.keys(dayPeriodRows));
    return {
      weeklyDays,
      weeklyPeriodRows: cloneDefaultWeeklyPeriodRows(),
      dayPeriodRows,
    };
  }

  if (body.mode === "weekly") {
    const weeklyRows = body.periods.map(apiPeriodItemToRow);

    if (Object.keys(dayPeriodRows).length === 0) {
      dayPeriodRows = {};
      for (const d of body.days) {
        dayPeriodRows[d] = weeklyRows.map((r) => ({ ...r }));
      }
    }

    const weeklyDays = sortWeekdaysForApi([
      ...body.days,
      ...Object.keys(dayPeriodRows),
    ]);

    return {
      weeklyDays,
      weeklyPeriodRows: weeklyRows,
      dayPeriodRows,
    };
  }

  const fromSchedule = scheduleToDayPeriodRows(body.schedule);
  if (Object.keys(dayPeriodRows).length === 0) {
    dayPeriodRows = fromSchedule;
  }

  const weeklyDays = sortWeekdaysForApi([
    ...Object.keys(dayPeriodRows),
    ...Object.keys(fromSchedule),
  ]);

  if (weeklyDays.length === 0) return null;

  return {
    weeklyDays,
    weeklyPeriodRows: cloneDefaultWeeklyPeriodRows(),
    dayPeriodRows,
  };
}
