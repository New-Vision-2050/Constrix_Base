import { Button } from "@/components/ui/button";
import { useAttendanceDayCxt } from "../context/AttendanceDayCxt";
import { useFormStore } from "@/modules/form-builder";
import { DAYS_OF_WEEK } from "../constants/days";

export default function SaveButton() {
  const { selectedDay, dayPeriods } = useAttendanceDayCxt();

  const handleSave = () => {
    // prepare periods - keep extends_to_next_day info within the same day
    // Don't create separate next day entry
    const _periods = dayPeriods?.map((period) => {
      return {
        index: period.index,
        from: period.start_time,
        // Keep the actual end_time (on next day) - don't change to 23:59
        to: period.end_time,
        early_period: period.early_period,
        early_unit: period.early_unit,
        lateness_period: period.lateness_period,
        lateness_unit: period.lateness_unit,
        extends_to_next_day: period.extends_to_next_day,
      };
    });

    // prepare day config - all period info stays within this day
    const _dayConfig = {
      day: selectedDay,
      periods: _periods,
    };

    // get current weekly schedule
    let _weekly_schedule = useFormStore
      ?.getState()
      .getValue("create-determinant-form", "weekly_schedule");

    if (!_weekly_schedule) _weekly_schedule = [];

    // remove day if exist
    _weekly_schedule = _weekly_schedule?.filter(
      (day: any) => day.day !== selectedDay,
    );

    // update weekly schedule - just add the day config, no separate next day entry
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
