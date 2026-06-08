import { Button } from "@/components/ui/button";
import {
  useAttendanceDayCxt,
  type AttendanceDayEditedDay,
} from "../context/AttendanceDayCxt";
import { useFormStore } from "@/modules/form-builder";
import { useTranslations } from "next-intl";

export default function SaveButton() {
  const { selectedDay, dayPeriods, onSaveStandalone, onCloseStandalone } =
    useAttendanceDayCxt();
  const t = useTranslations("HRSettingsAttendanceDepartureModule.attendanceDeterminants.form.AttendanceDaysDialog");

  const handleSave = () => {
    const _periods = dayPeriods?.map((period) => {
      return {
        index: period.index,
        from: period.start_time,
        to: period.end_time,
        early_period: period.early_period,
        early_unit: period.early_unit,
        lateness_period: period.lateness_period,
        lateness_unit: period.lateness_unit,
        extends_to_next_day: period.extends_to_next_day,
      };
    });

    const _dayConfig: AttendanceDayEditedDay = {
      day: selectedDay,
      periods: _periods,
    };

    if (onSaveStandalone) {
      onSaveStandalone(_dayConfig);
      onCloseStandalone?.();
      return;
    }

    // get current weekly schedule
    let _weekly_schedule = useFormStore
      ?.getState()
      .getValue("create-determinant-form", "weekly_schedule");

    if (!_weekly_schedule) _weekly_schedule = [];

    // remove day if exist
    _weekly_schedule = _weekly_schedule?.filter(
      (day: { day: string }) => day.day !== selectedDay,
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
      {t("save")}
    </Button>
  );
}
