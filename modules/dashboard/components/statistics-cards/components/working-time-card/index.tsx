import WorkingTimeCardInformation from "./card-information";
import WorkingTimeCardChart from "./working-time-chart";

export default function WorkingTimeCard() {
  return (
    <div className="flex flex-col justify-between w-full p-4 bg-sidebar rounded-lg shadow-md">
      <div className="flex justify-between items-start">
        {/* information */}
        <WorkingTimeCardInformation />
        {/* chart */}
        <WorkingTimeCardChart />
      </div>
    </div>
  );
}
