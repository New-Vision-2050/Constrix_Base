"use client";

import { ChevronDown, LayoutList } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useAttendancePresence } from "../../context/AttendancePresenceContext";
import { useUserConstraintToday } from "../../hooks/useAttendanceActions";
import { useAttendanceDirection } from "../../utils/direction";
import { formatApiTime, getActiveWorkPeriod } from "../../utils/attendance";
import { StatusDot } from "../shared/StatusDot";
import { STATUS_HEX_COLORS } from "../../utils/status-colors";
import SummaryCardShell from "./SummaryCardShell";

const PERIOD_LABEL_KEYS = ["period1", "period2", "period3"] as const;

function PeriodDots({
  count,
  activeIndex,
  onSelect,
}: {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  const t = useTranslations("AttendancePresence");

  return (
    <div className="flex flex-col items-center justify-center gap-1.5 py-1">
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          type="button"
          aria-label={t(PERIOD_LABEL_KEYS[index] ?? "period1")}
          onClick={() => onSelect(index)}
          className={`rounded-full transition-colors ${
            index === activeIndex
              ? "size-2 bg-muted-foreground"
              : "size-2 border border-muted-foreground/60 bg-transparent"
          }`}
        />
      ))}
    </div>
  );
}

export default function CurrentPeriodCard() {
  const t = useTranslations("AttendancePresence");
  const locale = useLocale();
  const { isRtl } = useAttendanceDirection();
  const { activePeriod, setActivePeriod } = useAttendancePresence();
  const { data } = useUserConstraintToday();

  const apiPeriods = data?.work_rules.all_work_periods ?? [];
  const activeApiPeriod = getActiveWorkPeriod(apiPeriods);
  const periodIndex = Math.max(
    0,
    Number.parseInt(activePeriod.replace("period-", ""), 10) - 1,
  );
  const currentPeriod = apiPeriods[periodIndex] ?? activeApiPeriod;
  const isShiftActive = Boolean(currentPeriod?.is_active);

  const timeRange = currentPeriod
    ? `${formatApiTime(currentPeriod.start_time, locale).display} - ${formatApiTime(currentPeriod.end_time, locale).display}`
    : "—";

  return (
    <SummaryCardShell
      icon={<LayoutList size={18} className="text-primary" />}
      title={t("currentPeriod")}
      className="relative"
      footer={
        <div className="flex justify-center pt-1">
          <ChevronDown size={16} className="text-muted-foreground" />
        </div>
      }
    >
      <div className="flex items-stretch gap-3">
        {isRtl ? (
          <>
            <div className="flex-1 min-w-0">
              <p className="text-lg font-semibold text-primary mb-1">
                {t(PERIOD_LABEL_KEYS[periodIndex] ?? "period1")}
              </p>
              <div className="flex items-center gap-2">
                {isShiftActive ? (
                  <StatusDot dotColor={STATUS_HEX_COLORS.present} className="shrink-0" />
                ) : null}
                <p className="text-sm text-foreground" dir="ltr">
                  {timeRange}
                </p>
              </div>
            </div>
            {apiPeriods.length > 1 ? (
              <PeriodDots
                count={apiPeriods.length}
                activeIndex={periodIndex}
                onSelect={(index) => setActivePeriod(`period-${index + 1}`)}
              />
            ) : null}
          </>
        ) : (
          <>
            {apiPeriods.length > 1 ? (
              <PeriodDots
                count={apiPeriods.length}
                activeIndex={periodIndex}
                onSelect={(index) => setActivePeriod(`period-${index + 1}`)}
              />
            ) : null}
            <div className="flex-1 min-w-0">
              <p className="text-lg font-semibold text-primary mb-1">
                {t(PERIOD_LABEL_KEYS[periodIndex] ?? "period1")}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-foreground" dir="ltr">
                  {timeRange}
                </p>
                {isShiftActive ? (
                  <StatusDot dotColor={STATUS_HEX_COLORS.present} className="shrink-0" />
                ) : null}
              </div>
            </div>
          </>
        )}
      </div>
    </SummaryCardShell>
  );
}
