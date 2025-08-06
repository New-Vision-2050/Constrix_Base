import { Button } from "@/components/ui/button";
import AttendanceDayPeriod from "./AttendanceDayPeriod";

export default function AttendanceDayPeriods() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center my-1">
        <p className="text-lg font-semibold">فترات عمل اليوم</p>
        <Button>إضافة فترة</Button>
      </div>
      <AttendanceDayPeriod title="فترة 1" />
      <AttendanceDayPeriod title="فترة 2" />
    </div>
  );
}
