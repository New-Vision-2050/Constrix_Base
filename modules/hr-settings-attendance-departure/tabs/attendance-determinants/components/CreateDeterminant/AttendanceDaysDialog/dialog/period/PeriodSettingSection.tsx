import {
  AttendanceDayPeriodType,
  useAttendanceDayCxt,
} from "../../context/AttendanceDayCxt";
import { TimeUnits } from "@/modules/hr-settings-attendance-departure/tabs/attendance-determinants/constants/determinants";
import DurationUnitField from "./DurationUnitField";

type PropsT = {
  t: (key: string) => string;
  period: AttendanceDayPeriodType;
};

export default function PeriodSettingSection({ t, period }: PropsT) {
  const { handleUpdateDayPeriod, isEdit } = useAttendanceDayCxt();

  const sanitizeNonNegative = (value: string) => {
    if (value === "") return "";
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) return "";
    return String(Math.max(0, numericValue));
  };

  const handleEarlyPeriodChange = (value: string) => {
    handleUpdateDayPeriod({
      ...period,
      early_period: sanitizeNonNegative(value),
    });
  };

  const handleEarlyUnitChange = (value: string) => {
    handleUpdateDayPeriod({
      ...period,
      early_unit: value,
    });
  };

  const handleLatenessPeriodChange = (value: string) => {
    handleUpdateDayPeriod({
      ...period,
      lateness_period: sanitizeNonNegative(value),
    });
  };

  const handleLatenessUnitChange = (value: string) => {
    handleUpdateDayPeriod({
      ...period,
      lateness_unit: value,
    });
  };

  return (
    <div className="mt-4 grid grid-cols-1 gap-6 p-2 md:grid-cols-2">
      <DurationUnitField
        label={t("earlyPeriodLabel")}
        value={period?.early_period ?? ""}
        unit={period?.early_unit || TimeUnits[0]?.id || "minute"}
        unitOptions={TimeUnits}
        placeholder="30"
        disabled={isEdit}
        onValueChange={handleEarlyPeriodChange}
        onUnitChange={handleEarlyUnitChange}
      />

      <DurationUnitField
        label={t("latenessPeriodLabel")}
        value={period?.lateness_period ?? ""}
        unit={period?.lateness_unit || TimeUnits[0]?.id || "minute"}
        unitOptions={TimeUnits}
        placeholder="30"
        onValueChange={handleLatenessPeriodChange}
        onUnitChange={handleLatenessUnitChange}
      />
    </div>
  );
}
