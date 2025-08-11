import { Button } from "@/components/ui/button";
import { useAttendanceDayCxt } from "../context/AttendanceDayCxt";
import { useFormStore } from "@/modules/form-builder";
import { DAYS_OF_WEEK } from "../constants/days";

export default function SaveButton() {
  const { selectedDay, dayPeriods } = useAttendanceDayCxt();

  const handleSave = () => {
    // prepare periods
    let _extendedPeriod: any;
    const _periods = dayPeriods?.map((period) => {
      const _end = period?.extends_to_next_day ? "23:59" : period.end_time;
      if (period?.extends_to_next_day) {
        _extendedPeriod = period;
      }
      return {
        index: period.index,
        from: period.start_time,
        to: _end,
        early_period: period.early_period,
        early_unit: period.early_unit,
        lateness_period: period.lateness_period,
        lateness_unit: period.lateness_unit,
        extends_to_next_day: period.extends_to_next_day,
      };
    });
    // prepare day config
    const _dayConfig = {
      day: selectedDay,
      periods: _periods,
    };
    // prepare nextday config
    let _nextDayConfig: any;
    let _nextDayConfigExist = false;

    if (_extendedPeriod) {
      const _currentDayIndex = DAYS_OF_WEEK.findIndex(
        (day) => day.value === selectedDay
      );
      const _nextDayIndex = (_currentDayIndex + 1) % DAYS_OF_WEEK.length;
      // get next day config if exist
      _nextDayConfig = useFormStore
        ?.getState()
        .getValue("create-determinant-form", "weekly_schedule")
        ?.find((day: any) => day.day === DAYS_OF_WEEK[_nextDayIndex].value);

      if (!_nextDayConfig) {
        _nextDayConfigExist = true;
        _nextDayConfig = {
          day: DAYS_OF_WEEK[_nextDayIndex].value,
          periods: [
            {
              index: 1,
              from: "00:00",
              to: _extendedPeriod.end_time,
              early_period: "30",
              early_unit: "minute",
              lateness_period: "30",
              lateness_unit: "minute",
              extends_to_next_day: false,
            },
          ],
        };
      } else {
        _nextDayConfig.periods.push({
          index: _nextDayConfig.periods.length + 1,
          from: "00:00",
          to: _extendedPeriod.end_time,
          early_period: "30",
          early_unit: "minute",
          lateness_period: "30",
          lateness_unit: "minute",
          extends_to_next_day: false,
        });
      }
    }
    // get current weekly schedule
    let _weekly_schedule = useFormStore
      ?.getState()
      .getValue("create-determinant-form", "weekly_schedule");

    if (!_weekly_schedule) _weekly_schedule = [];
    // remove day if exist
    _weekly_schedule = _weekly_schedule?.filter(
      (day: any) => day.day !== selectedDay
    );
    // update weekly schedule
    if (_nextDayConfig) {
      if (_nextDayConfigExist) {
        useFormStore?.getState().setValues("create-determinant-form", {
          weekly_schedule: [..._weekly_schedule, _dayConfig, _nextDayConfig],
        });
      } else {
        useFormStore?.getState().setValues("create-determinant-form", {
          weekly_schedule: [
            ..._weekly_schedule?.map((day: any) => {
              if (day.day === _nextDayConfig.day) {
                return _nextDayConfig;
              }
              return day;
            }),
            _dayConfig,
          ],
        });
      }
    } else {
      useFormStore?.getState().setValues("create-determinant-form", {
        weekly_schedule: [..._weekly_schedule, _dayConfig],
      });
    }

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
