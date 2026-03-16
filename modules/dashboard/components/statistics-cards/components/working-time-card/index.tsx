import WorkingTimeCardInformation from "./card-information";
import WorkingTimeCardChart from "./working-time-chart";

export default function WorkingTimeCard() {
  return (
    <div className="min-h-[177px] w-[250px] min-w-[250px] flex-shrink-0 flex flex-col justify-between overflow-hidden p-4 bg-sidebar rounded-lg shadow-md">
      <div className="flex min-w-0 justify-between items-start gap-3">
        {/* information */}
        <div className="min-w-0 flex-1">
          <WorkingTimeCardInformation />
        </div>
        {/* chart */}
        <div className="shrink-0 overflow-hidden">
          <WorkingTimeCardChart />
        </div>
      </div>
    </div>
  );
}
