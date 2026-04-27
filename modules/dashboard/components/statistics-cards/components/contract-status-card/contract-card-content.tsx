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
  const [remainingDays, setRemainingDays] = useState<number>();

  // handle side effects
  useEffect(() => {
    if (contractData) {
      const today = new Date();
      const startDate = new Date(contractData?.start_date ?? "");
      const endDate = new Date(contractData?.end_date ?? "");

      const totalDuration = endDate.getTime() - startDate.getTime();

      if (totalDuration > 0) {
        const now =
          today < startDate ? startDate : today > endDate ? endDate : today;

        const passedDuration = now.getTime() - startDate.getTime();

        const _passedPercentage = Math.min(
          100,
          Math.max(0, (passedDuration / totalDuration) * 100)
        );

        setPassedPercentage(_passedPercentage);

        const _remainingDays = Math.max(
          0,
          Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        );
        setRemainingDays(_remainingDays);
      } else {
        setPassedPercentage(0);
        setRemainingDays(0);
      }
    }
  }, [contractData]);

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

        {/* Remaining Days */}
        <div className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-gray-700">
          <span className="text-sm font-small">{remainingDays ?? "-"}</span>
        </div>

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
        <ContractStatusProgressBar value={passedPercentage ?? 1} />
      </div>
    </div>
  );
}
