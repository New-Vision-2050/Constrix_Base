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

export default function PeriodValidationsMsgs({ t, period }: PropsT) {
  const { handleUpdateDayPeriod } = useAttendanceDayCxt();

  return (
    <div className="text-xs mt-1 flex flex-col gap-2">
      <span className="italic text-gray-500">{t("timeFormatError")}</span>
      <div className="flex gap-1 items-center">
        <Checkbox
          id="extends-next-day"
          checked={period.extends_to_next_day || false}
          onCheckedChange={(checked) => {
            handleUpdateDayPeriod({
              ...period,
              extends_to_next_day: checked as boolean,
            });
          }}
        />
        <Label
          htmlFor="extends-next-day"
          className="text-sm font-medium cursor-pointer"
        >
          {t("extendsToNextDay")}
        </Label>
      </div>
      {/* warning message if extends_to_next_day is checked and end_time is less than start_time */}
      {period.extends_to_next_day && (
        <span className="italic text-gray-500">{t("extendsToNextDayWarning")}</span>
      )}
    </div>
  );
}
