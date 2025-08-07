import { Button } from "@/components/ui/button";
import AttendanceDayPeriod from "./AttendanceDayPeriod";
import { useAttendanceDayCxt } from "../context/AttendanceDayCxt";

export default function AttendanceDayPeriods() {
  const { dayPeriods, handleAddDayPeriod } = useAttendanceDayCxt();
  console.log("dayPeriods", dayPeriods);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center my-1">
        <p className="text-lg font-semibold">فترات عمل اليوم</p>
        <Button onClick={handleAddDayPeriod}>إضافة فترة</Button>
      </div>
      {dayPeriods.map((period, index) => (
        <AttendanceDayPeriod
          key={index}
          title={`فترة ${period.index}`}
          period={period}
        />
      ))}
    </div>
  );
}
