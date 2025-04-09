import WorkingTimeCardInformation from "./card-information";
import WorkingTimeCardChart from "./working-time-chart";

export default function WorkingTimeCard() {
  return (
    <div className="min-h-[177px] w-[250px] flex flex-col justify-between p-4 bg-sidebar rounded-lg shadow-md">
      <div className="flex justify-between items-start">
        {/* information */}
        <WorkingTimeCardInformation />
        {/* chart */}
        <WorkingTimeCardChart />
      </div>
    </div>
  );
}
