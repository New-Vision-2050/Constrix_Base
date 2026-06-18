"use client";

import { ChevronDown, LayoutList } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAttendancePresence } from "../../context/AttendancePresenceContext";
import { MOCK_WORK_PERIODS } from "../../constants/mock-data";
import { useCurrentDateTime } from "../../hooks/useCurrentDateTime";
import { useAttendanceDirection } from "../../utils/direction";
import { getShiftRemainingMinutes } from "../../utils/time";
import { StatusDot } from "../shared/StatusDot";
import { STATUS_HEX_COLORS } from "../../utils/status-colors";
import SummaryCardShell from "./SummaryCardShell";

const PERIOD_LABEL_KEYS = ["period1", "period2", "period3"] as const;

function PeriodDots({
  activeIndex,
  onSelect,
}: {
  activeIndex: number;
  onSelect: (id: string) => void;
}) {
  const t = useTranslations("AttendancePresence");

  return (
    <div className="flex flex-col items-center justify-center gap-1.5 py-1">
      {MOCK_WORK_PERIODS.map((period, index) => (
        <button
          key={period.id}
          type="button"
          aria-label={t(PERIOD_LABEL_KEYS[index])}
          onClick={() => onSelect(period.id)}
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
  const { isRtl } = useAttendanceDirection();
  const now = useCurrentDateTime();
  const { activePeriod, setActivePeriod } = useAttendancePresence();

  const currentPeriod = MOCK_WORK_PERIODS.find((period) => period.id === activePeriod);
  const periodIndex = MOCK_WORK_PERIODS.findIndex((period) => period.id === activePeriod);

  const isActive = currentPeriod
    ? getShiftRemainingMinutes(now, currentPeriod) > 0
    : false;

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
                {periodIndex >= 0 ? t(PERIOD_LABEL_KEYS[periodIndex]) : t("period1")}
              </p>
              <div className="flex items-center gap-2">
                {isActive ? (
                  <StatusDot dotColor={STATUS_HEX_COLORS.present} className="shrink-0" />
                ) : null}
                <p className="text-sm text-foreground" dir="ltr">
                  {currentPeriod
                    ? `${currentPeriod.startTime} - ${currentPeriod.endTime}`
                    : "—"}
                </p>
              </div>
            </div>
            <PeriodDots
              activeIndex={periodIndex}
              onSelect={setActivePeriod}
            />
          </>
        ) : (
          <>
            <PeriodDots
              activeIndex={periodIndex}
              onSelect={setActivePeriod}
            />
            <div className="flex-1 min-w-0">
              <p className="text-lg font-semibold text-primary mb-1">
                {periodIndex >= 0 ? t(PERIOD_LABEL_KEYS[periodIndex]) : t("period1")}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-foreground" dir="ltr">
                  {currentPeriod
                    ? `${currentPeriod.startTime} - ${currentPeriod.endTime}`
                    : "—"}
                </p>
                {isActive ? (
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
