import AttendanceDepartureStatisticsCards from "./components/AttendanceDepartureStatisticsCards";
import AttendanceDateSelector from "./components/AttendanceDateSelector";

export default function AttendanceDepartureIndex() {
  return (
    <div className="flex flex-col gap-4 container px-6">
      <AttendanceDateSelector />
      <AttendanceDepartureStatisticsCards />
    </div>
  );
}
