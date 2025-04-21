import CalendarRangeIcon from "@/public/icons/calendar-range";
import ContractStatusProgressBar from "./Card-Progress-Bar";
import { ProfileWidgetContract } from "@/modules/user-profile/types/profile-widgets";
import { useEffect, useState } from "react";

type PropsT = {
  contractData?: ProfileWidgetContract;
};

export default function ContractStatusCardContent({ contractData }: PropsT) {
  // declare and define helper state and variables
  const [passedPercentage, setPassedPercentage] = useState<number>();

  // handle side effects
  useEffect(() => {
    if (contractData) {
      const today = new Date();
      const startDate = new Date(contractData?.start_date ?? "");
      const endDate = new Date(contractData?.end_date ?? "");

      const now =
        today < startDate ? startDate : today > endDate ? endDate : today;

      const totalDuration = endDate.getTime() - startDate.getTime();
      const passedDuration = now.getTime() - startDate.getTime();

      const _passedPercentage = Math.min(
        100,
        Math.max(0, (passedDuration / totalDuration) * 100)
      );

      setPassedPercentage(_passedPercentage);
    }
  }, [contractData]);

  // declare and define
  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex items-center justify-between">
        {/* Start Date */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-pink-100 flex items-center justify-center rounded-md">
              <CalendarRangeIcon additionalClass="text-pink-500 w-[15px]" />
            </div>
            <span className="text-sm">بداية العقد</span>
          </div>
          <span className="text-lg font-semibold ">
            {passedPercentage &&
              `${(isNaN(passedPercentage) ? 0 : passedPercentage)?.toFixed(
                1
              )} %`}
          </span>
          <span className="text-sm ">{contractData?.start_date}</span>
        </div>

        {/* Divider */}
        <div className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-gray-700">
          <span className="text-sm font-small">20</span>
        </div>

        {/* End Date */}
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <span className="text-sm">نهاية العقد</span>
            <div className="w-6 h-6 bg-yellow-100 flex items-center justify-center rounded-md">
              <CalendarRangeIcon additionalClass="text-yellow-500 w-[15px]" />
            </div>
          </div>
          <span className="text-lg font-semibold">
            {passedPercentage &&
              `${(isNaN(100 - (passedPercentage ?? 0))
                ? 0
                : 100 - (passedPercentage ?? 0)
              )?.toFixed(1)} %`}
          </span>
          <span className="text-sm">{contractData?.end_date}</span>
        </div>
      </div>
      {/* Progress Bar */}
      <ContractStatusProgressBar value={passedPercentage ?? 1} />
    </div>
  );
}
