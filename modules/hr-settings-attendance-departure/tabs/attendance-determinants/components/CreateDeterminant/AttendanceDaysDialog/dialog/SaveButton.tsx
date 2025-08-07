import { Button } from "@/components/ui/button";
import { useAttendanceDayCxt } from "../context/AttendanceDayCxt";

export default function SaveButton() {
  const { selectedDay, dayPeriods } = useAttendanceDayCxt();

  const handleSave = () => {
    console.log("selectedDay", selectedDay);
    console.log("dayPeriods", dayPeriods);
  };

  return (
    <Button
      disabled={selectedDay === ""}
      onClick={handleSave}
      className="w-full"
    >
      حفظ
    </Button>
  );
}
