import { Checkbox } from "@/components/ui/checkbox";
import {
  AttendanceDayPeriodType,
  useAttendanceDayCxt,
} from "../../context/AttendanceDayCxt";
import { Label } from "@/components/ui/label";

type PropsT = {
  t: (key: string) => string;
  period: AttendanceDayPeriodType;
};

// Convert times to comparable format (minutes since midnight)
const convertTimeToMinutes = (timeString: string): number => {
  if (!timeString) return 0;
  const [hours, minutes] = timeString?.split(":")?.map(Number);
  return hours * 60 + minutes;
};

export default function PeriodValidationsMsgs({ t, period }: PropsT) {
  const { handleUpdateDayPeriod, maxEdge, extendsToNextDayMsg } =
    useAttendanceDayCxt();

  // handle change
  const handleChange = (checked: boolean) => {
    // Check if we're unchecking the box and end time is before start time
    const startMinutes = convertTimeToMinutes(period.start_time);
    const endMinutes = convertTimeToMinutes(period.end_time);

    if (!checked && period.extends_to_next_day && endMinutes < startMinutes) {
      // Reset both times when unchecking with invalid time configuration
      handleUpdateDayPeriod({
        ...period,
        extends_to_next_day: checked,
        start_time: "",
        end_time: "",
      });
    } else {
      // Normal update - don't force end_time, let user select
      handleUpdateDayPeriod({
        ...period,
        extends_to_next_day: checked,
      });
    }
  };

  return (
    <div className="text-xs mt-1 flex flex-col gap-2">
      <span className="italic text-gray-500">{t("timeFormatError")}</span>
      {(maxEdge == period.end_time || period.extends_to_next_day) && (
        <div className="flex gap-1 items-center">
          <Checkbox
            id="extends-next-day"
            checked={period.extends_to_next_day || false}
            onCheckedChange={handleChange}
          />
          <Label
            htmlFor="extends-next-day"
            className="text-sm font-medium cursor-pointer"
          >
            {t("extendsToNextDay")}
          </Label>
        </div>
      )}
      {/* warning message if extends_to_next_day is checked and end_time is less than start_time */}
      {period.extends_to_next_day && (
        <div className="flex gap-1 flex-col">
          <span className="italic text-gray-500">
            {t("extendsToNextDayWarning")}
          </span>
          <span className="italic text-yellow-500">{extendsToNextDayMsg}</span>
        </div>
      )}
    </div>
  );
}
