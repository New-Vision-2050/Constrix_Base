import ContractStatusProgressBar from "@/modules/dashboard/components/statistics-cards/components/contract-status-card/Card-Progress-Bar";
import { StatisticsCardInfo } from ".";

type PropsT = {
  progressBarValue?: number;
  leftSideInfo?: StatisticsCardInfo;
  rightSideInfo?: StatisticsCardInfo;
};
export default function StatisticsCardFooter(props: PropsT) {
  const { progressBarValue, leftSideInfo, rightSideInfo } = props;

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex items-center justify-between gap-4">
        {/* Start Date */}
        <div className="flex flex-col">
          <span className="text-md font-semibold">{leftSideInfo?.count}</span>
          <span className="text-sm">{leftSideInfo?.description}</span>
        </div>

        {/* End Date */}
        <div className="flex flex-col items-end">
          <span className="text-md font-semibold">{rightSideInfo?.count}</span>
          <span className="text-sm">{rightSideInfo?.description}</span>
        </div>
      </div>
      {/* Progress Bar */}
      <ContractStatusProgressBar value={progressBarValue ?? 0} />
    </div>
  );
}
