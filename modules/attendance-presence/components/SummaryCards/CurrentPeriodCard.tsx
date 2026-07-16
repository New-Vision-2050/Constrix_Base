"use client";

import { ChevronDown, LayoutList } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useAttendancePresence } from "../../context/AttendancePresenceContext";
import { useUserConstraintToday } from "../../hooks/useAttendanceActions";
import { useAttendanceDirection } from "../../utils/direction";
import {
  buildWorkPeriodTabs,
  formatApiTime,
  getActiveWorkPeriod,
  getWorkPeriodByTabId,
} from "../../utils/attendance";
import { StatusDot } from "../shared/StatusDot";
import { STATUS_HEX_COLORS } from "../../utils/status-colors";
import SummaryCardShell from "./SummaryCardShell";

function PeriodDots({
  count,
  activeIndex,
  onSelect,
  getAriaLabel,
}: {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  getAriaLabel: (index: number) => string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 py-1">
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          type="button"
          aria-label={getAriaLabel(index)}
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

  const workRules = data?.work_rules;
  const isHoliday = Boolean(workRules?.is_holiday);
  const apiPeriods = workRules?.all_work_periods ?? [];
  const periodTabs = buildWorkPeriodTabs(apiPeriods, (key, values) =>
    t(key as "period1", values),
  );
  const activeApiPeriod = getActiveWorkPeriod(apiPeriods);
  const periodIndex = Math.max(
    0,
    Number.parseInt(activePeriod.replace("period-", ""), 10) - 1,
  );
  const currentPeriod =
    getWorkPeriodByTabId(apiPeriods, activePeriod) ?? activeApiPeriod;
  const isShiftActive = Boolean(currentPeriod?.is_active);
  const periodLabel =
    periodTabs[periodIndex]?.label ?? periodTabs[0]?.label ?? t("period1");

  const timeRange = currentPeriod
    ? `${formatApiTime(currentPeriod.start_time, locale).display} - ${formatApiTime(currentPeriod.end_time, locale).display}`
    : "—";

  return (
    <SummaryCardShell
      icon={<LayoutList size={18} />}
      title={t("currentPeriod")}
      accent="#3B9EFF"
      className="relative"
      footer={
        <div className="flex justify-center pt-1">
          <ChevronDown size={16} className="text-muted-foreground" />
        </div>
      }
    >
      {isHoliday ? (
        <div className="py-2 text-center">
          <p className="text-lg font-semibold text-[#FF2D78]">
            {t("happyHoliday")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {workRules?.reason || t("happyHolidayMessage")}
          </p>
        </div>
      ) : (
        <div className="flex items-stretch gap-3">
          {isRtl ? (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-semibold text-primary mb-1">
                  {periodLabel}
                </p>
                <div className="flex items-center gap-2">
                  {isShiftActive ? (
                    <StatusDot
                      dotColor={STATUS_HEX_COLORS.present}
                      className="shrink-0"
                    />
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
                  getAriaLabel={(index) =>
                    periodTabs[index]?.label ?? t("period1")
                  }
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
                  getAriaLabel={(index) =>
                    periodTabs[index]?.label ?? t("period1")
                  }
                />
              ) : null}
              <div className="flex-1 min-w-0">
                <p className="text-lg font-semibold text-primary mb-1">
                  {periodLabel}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-foreground" dir="ltr">
                    {timeRange}
                  </p>
                  {isShiftActive ? (
                    <StatusDot
                      dotColor={STATUS_HEX_COLORS.present}
                      className="shrink-0"
                    />
                  ) : null}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </SummaryCardShell>
  );
}
