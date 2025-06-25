import AttendanceDepartureStatisticsCards from "./components/AttendanceDepartureStatisticsCards";
import AttendanceDateSelector from "./components/AttendanceDateSelector";
import AttendanceDepartureTable from "./components/AttendanceDepartureTable";
import AttendanceDepartureSearchFilter from "./components/AttendanceDepartureSearchFilter";

export default function AttendanceDepartureIndex() {
  return (
    <div className="flex flex-col gap-4 container px-6">
      <AttendanceDateSelector />
      <AttendanceDepartureStatisticsCards />
      <AttendanceDepartureSearchFilter />
      <AttendanceDepartureTable />
    </div>
  );
}
