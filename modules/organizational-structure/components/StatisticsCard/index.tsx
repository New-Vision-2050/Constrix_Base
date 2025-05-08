import StatisticsCardFooter from "./StatisticsCardFooter";
import StatisticsCardHeader from "./StatisticsCardHeader";

export type StatisticsCardInfo = { count?: string; description?: string };

type PropsT = {
  title?: string | number;
  number?: string | number;
  icon?: JSX.Element;
  description?: string | number;
  progressBarValue?: number;
  leftSideInfo?: StatisticsCardInfo;
  rightSideInfo?: StatisticsCardInfo;
};

export default function StatisticsCard(props: PropsT) {
  const {
    icon,
    title,
    description,
    number,
    progressBarValue,
    leftSideInfo,
    rightSideInfo,
  } = props;

  return (
    <div className="flex min-h-[177px] w-min-[320px] flex-col justify-between bg-sidebar shadow-md rounded-lg p-4">
      <StatisticsCardHeader
        icon={icon}
        title={title}
        number={number}
        description={description}
      />
      <StatisticsCardFooter
        progressBarValue={progressBarValue}
        leftSideInfo={leftSideInfo}
        rightSideInfo={rightSideInfo}
      />
    </div>
  );
}
