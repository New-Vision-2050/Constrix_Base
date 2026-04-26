import CalendarRangeIcon from "@/public/icons/calendar-range";
import ContractStatusProgressBar from "./Card-Progress-Bar";
import { ProfileWidgetContract } from "@/modules/user-profile/types/profile-widgets";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

type PropsT = {
  contractData?: ProfileWidgetContract;
};

export default function ContractStatusCardContent({ contractData }: PropsT) {
  // declare and define helper state and variables
  const t = useTranslations("UserProfile.header.statisticsCards");
  const [passedPercentage, setPassedPercentage] = useState<number>();
  const [totalDays, setTotalDays] = useState<number>();
  const [passedDays, setPassedDays] = useState<number>();

  // handle side effects
  useEffect(() => {
    if (contractData) {
      const today = new Date();
      const startDate = new Date(contractData?.start_date ?? "");
      const endDate = new Date(contractData?.end_date ?? "");

      const totalMs = endDate.getTime() - startDate.getTime();

      if (totalMs > 0) {
        const _totalDays = Math.round(totalMs / (1000 * 60 * 60 * 24));
        const now =
          today < startDate ? startDate : today > endDate ? endDate : today;
        const passedMs = now.getTime() - startDate.getTime();
        const _passedDays = Math.round(passedMs / (1000 * 60 * 60 * 24));
        const _passedPercentage = Math.min(
          100,
          Math.max(0, (_passedDays / _totalDays) * 100)
        );

        setTotalDays(_totalDays);
        setPassedDays(_passedDays);
        setPassedPercentage(_passedPercentage);
      } else {
        setTotalDays(0);
        setPassedDays(0);
        setPassedPercentage(0);
      }
    }
  }, [contractData]);

  const trialDays = contractData?.trial_period_days ?? 0;
  const noticeDays = contractData?.notice_period_days ?? 0;
  const isNearExpiry =
    noticeDays > 0 &&
    (passedDays ?? 0) >= (totalDays ?? 0) - noticeDays &&
    (totalDays ?? 0) > 0;

  const showPercentage = passedPercentage !== undefined && !isNaN(passedPercentage);
  const startPercentage = showPercentage ? passedPercentage?.toFixed(1) : "-";
  const endPercentage = showPercentage
    ? (100 - (passedPercentage ?? 0))?.toFixed(1)
    : "-";

  // declare and define
  return (
    <div className="flex min-w-0 flex-col gap-3 mt-3">
      <div className="flex min-w-0 items-center justify-between gap-2">
        {/* Start Date */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 shrink-0 bg-pink-100 flex items-center justify-center rounded-md">
              <CalendarRangeIcon additionalClass="text-pink-500 w-[12px]" />
            </div>
            <span className="text-xs truncate">{t("contractStart")}</span>
          </div>
          <span className="text-base font-semibold truncate">
            {`${startPercentage} %`}
          </span>
          <span className="text-xs truncate">{contractData?.start_date}</span>
        </div>

        {/* Total Contract Days - Progress Ring */}
        {(() => {
          const size = 44;
          const strokeWidth = 4;
          const radius = (size - strokeWidth) / 2;
          const circumference = 2 * Math.PI * radius;
          const progress = Math.min(100, Math.max(0, passedPercentage ?? 0));
          const isComplete = progress >= 100;
          const dashOffset = circumference - (progress / 100) * circumference;
          const progressColor = isComplete ? "#22c55e" : "#2563eb";

          return (
            <div
              className="relative shrink-0 flex items-center justify-center"
              style={{ width: size, height: size }}
            >
              <svg
                className="absolute inset-0 -rotate-90"
                width={size}
                height={size}
              >
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth={strokeWidth}
                />
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={progressColor}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  style={{ transition: "stroke-dashoffset 0.5s ease, stroke 0.3s ease" }}
                />
              </svg>
              <span
                className={`relative text-xs font-semibold ${
                  isComplete ? "text-green-400" : "text-white"
                }`}
              >
                {totalDays ?? "-"}
              </span>
            </div>
          );
        })()}

        {/* End Date */}
        <div className="flex min-w-0 flex-1 flex-col items-end overflow-hidden">
          <div className="flex items-center gap-1.5">
            <span className="text-xs truncate">{t("contractEnd")}</span>
            <div className="w-5 h-5 shrink-0 bg-yellow-100 flex items-center justify-center rounded-md">
              <CalendarRangeIcon additionalClass="text-yellow-500 w-[12px]" />
            </div>
          </div>
          <span className="text-base font-semibold truncate">
            {`${endPercentage} %`}
          </span>
          <span className="text-xs truncate">{contractData?.end_date}</span>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="min-w-0">
        <ContractStatusProgressBar
          totalDays={totalDays ?? 0}
          trialDays={trialDays}
          noticeDays={noticeDays}
          passedDays={passedDays ?? 0}
        />
      </div>
    </div>
  );
}
