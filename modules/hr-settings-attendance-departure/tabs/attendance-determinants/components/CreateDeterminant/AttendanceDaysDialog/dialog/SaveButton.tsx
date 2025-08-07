import { Button } from "@/components/ui/button";
import { useAttendanceDayCxt } from "../context/AttendanceDayCxt";
import { useFormStore } from "@/modules/form-builder";

export default function SaveButton() {
  const { selectedDay, dayPeriods } = useAttendanceDayCxt();

  const handleSave = () => {
    // prepare periods
    const _periods = dayPeriods?.map((period) => ({
      from: period.start_time,
      to: period.end_time,
    }));
    // prepare day config
    const _dayConfig = {
      day: selectedDay,
      periods: _periods,
    };
    // get current weekly schedule
    const _weekly_schedule = useFormStore
      ?.getState()
      .getValue("create-determinant-form", "weekly_schedule");
    // update weekly schedule
    useFormStore?.getState().setValues("create-determinant-form", {
      weekly_schedule: [..._weekly_schedule, _dayConfig],
    });
    // close dialog
    useFormStore?.getState().setValues("create-determinant-form", {
      show_attendance_days_dialog: false,
    });
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
